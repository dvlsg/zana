/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    "use strict";
    function factory(z) {

        z.iterables = {};

        var _expand = function(iter) {
            if (iter && iter.isGenerator != null && iter.isGenerator()) {
                return iter(); // isGenerator() is a firefox-only thing. careful with this.
            }
            if (z.getType(iter) === z.types.array) {
                return iter[z.symbols.iterator]();
            }
            return iter;
        };

        z.iterables.aggregate = function(iter, func, seed) {
            var result,
                expandedIter = _expand(iter);
            if (seed == null)
                result = expandedIter.next().value;
            else
                result = func(seed, expandedIter.next().value);
            for (var v of expandedIter)
                result = func(result, v)
            return result;
        };

        z.iterables.any = function(iter, predicate) {
            if (z.check.isFunction(predicate)) {
                for (var v of iter) {
                    if (predicate(v))
                        return true;
                }
            }
            else {
                for (var v of iter) {
                    if (v != null)
                        return true;
                }
            }
            return false;
        };

        z.iterables.concat = function(/* ... iter */) {
            var args = Array.prototype.slice.call(arguments);
            console.log(arguments);
            return function*() {
                for (var arg of args) {
                    for (var v of _expand(arg))
                        yield v;
                }
            }
        };

        z.iterables.distinct = function(iter, selector) {
            var seen = [];
            if (z.check.isFunction(selector)) {
                return function*() {
                    for (var v of iter) {
                        var key = selector(v);
                        if (!seen.contains(key)) {
                            seen.push(key);
                            yield v;
                        }
                    }
                };
            }
            else {
                return function*() {
                    for (var v of iter) {
                        if (!seen.contains(v)) {
                            seen.push(v);
                            yield v; // this works too. may be more efficient?
                        }
                    }
                    // yield* z.arrays.asEnumerable(seen);
                };
            }
        };

        z.iterables.first = function(iter, predicate) {
            iter = _expand(iter);
            if (z.check.isFunction(predicate)) {
                for (var v of iter) {
                    if (predicate(v)) {
                        return v;
                    }
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.exists(v)) {
                        return v;
                    }
                }
            }
            return null;
        };

        z.iterables.innerJoin = function(iter1, iter2) {
            return {
                on: function(predicate) {
                    return function*() {
                        for (var item1 of iter1) {
                            for (var item2 of iter2) {
                                if (predicate(item1, item2)) {
                                    yield z.smash(item1, item2);
                                }
                            }
                        }
                    }
                }
                // consider extending this to have a sub-select method to avoid using z.smash by default
                // or allowing innerJoin to contain multiple sets of elements
                // (see .orderBy .thenBy for example of contained elements even when procedural)
            };
        };

        z.iterables.last = function(iter, predicate) {
            // we will have to iterate over the entire iterable in the generic case
            // array has its own specific implementation for last, since we know the end
            var current,
                previous,
                result = null,
                expandedIter = _expand(iter);

            if (z.getType(iter) === z.types.array) {
                // if the type is actually an array,
                // then make sure we use the more efficient
                // array specific implementation
                return z.arrays.last(iter, predicate);
            }
            if (z.check.isFunction(predicate)) {
                while (!(current = expandedIter.next()).done) {
                    if (predicate(current.value)) {
                        result = current.value;
                    }
                }
            }
            else {
                while (!(current = expandedIter.next()).done) {
                    previous = current; // or we could just assign result = a.value -- could be less efficient.
                }
                result = previous.value; // current will step "past" the end. previous will be the final.
            }
            return result;
        };

        z.iterables.max = function(iter, selector) {
            var maxValue = Number.MIN_VALUE;
            if (z.check.isFunction(selector)) {
                for (var v of iter) {
                    var selected = selector(v);
                    if (z.check.isNumber(selected) && maxValue < selected) {
                        maxValue = selected;
                    }
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.isNumber(v) && maxValue < v) {
                        maxValue = v;
                    }
                }
            }
            return maxValue;
        };

        z.iterables.min = function(iter, selector) {
            var minValue = Number.MAX_VALUE;
            if (z.check.isFunction(selector)) {
                for (var v of iter) {
                    var selected = selector(v);
                    if (z.check.isNumber(selected) && selected < minValue) {
                        minValue = selected;
                    }
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.isNumber(v) && v < minValue) {
                        minValue = v;
                    }
                }
            }
            return minValue;
        };

        var buildMapArray = function(count) {
            var mapArray = new Array(count);
            for (var i = 0; i < count; i++) {
                mapArray[i] = i;
            }
            return mapArray;
        };
        var buildKeyArray = function(elements, selector, count) {
            var keyArray = new Array(count);
            for (var i = 0; i < count; i++) {
                keyArray[i] = selector(elements[i]);
            };
            return keyArray;
        };
        var quicksort3 = function(keyArray, mapArray, comparer, left, right) {
            var indexForLessThan = left;
            var indexForGreaterThan = right;
            var pivotIndex = mapArray[left];
            var indexForIterator = left+1;
            while (indexForIterator <= indexForGreaterThan) {
                var cmp = comparer(keyArray[mapArray[indexForIterator]], keyArray[pivotIndex]);
                if (cmp < 0) {
                    z.arrays.swap(mapArray, indexForLessThan++, indexForIterator++);
                }
                else if (0 < cmp) {
                    z.arrays.swap(mapArray, indexForIterator, indexForGreaterThan--);
                }
                else {
                    indexForIterator++;
                }
            }
            if (left < indexForLessThan-1) {
                quicksort3(keyArray, mapArray, comparer, left, indexForLessThan-1);
            }
            if (indexForGreaterThan+1 < right) {
                quicksort3(keyArray, mapArray, comparer, indexForGreaterThan+1, right);
            }
        };
        z.iterables.orderBy = function(iter, selector, comparer) {
            if (!z.check.isFunction(selector))
                selector = z.functions.identity;
            if (!z.check.exists(comparer))
                comparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

            var yielder = function*() {
                // only execute the sort on iteration
                // this is due to the possibly orderBy().thenBy().thenBy() chained calls
                var elements = (z.getType(iter) === z.types.generator ? z.iterables.toArray(iter) : iter);
                var unsortedElements = z.iterables.toArray(
                    z.iterables.where(elements, x => yielder.selector(x) == null)
                );
                var unsortedCount = unsortedElements.length;
                var sortedElements = z.iterables.toArray(
                    z.iterables.where(elements, x => yielder.selector(x) != null)
                );
                var sortedCount = sortedElements.length;
                var sortedKeys = buildKeyArray(sortedElements, yielder.selector, sortedCount);
                var sortedMap = buildMapArray(sortedCount);
                quicksort3(sortedKeys, sortedMap, yielder.comparer, 0, sortedCount-1);
                for (var i = 0; i < sortedCount; i++) {
                    yield sortedElements[sortedMap[i]];
                }
                for (var v of unsortedElements) {
                    yield v;
                }
                return;
            };

            z.defineProperty(yielder, "thenBy", { enumerable: false, writable: true, configurable: true, value: thenBy.bind(yielder) });
            z.defineProperty(yielder, "selector", { enumerable: false, writable: true, configurable: true, value: selector });
            z.defineProperty(yielder, "comparer", { enumerable: false, writable: true, configurable: true, value: comparer });
            return yielder;
        };

        var thenBy = function(newSelector, newComparer) {
            var self = this;
            if (!z.check.isFunction(newComparer))
                newComparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

            // wrap the old selector in a new selector function
            // which will build all keys into a primary/secondary structure,
            // allowing the primary key selector to grow recursively
            // by appending new selectors on to the original selectors
            var oldSelector = self.selector; // store pointer to avoid accidental recursion
            self.selector = function(item) {
                return {
                    primary: oldSelector(item),
                    secondary: newSelector(item)
                }
            };

            // wrap the old comparer in a new comparer function
            // which will carry on down the line of comparers
            // in order until a non-zero is found, or until
            // we reach the new comparer
            var oldComparer = self.comparer; // store pointer to avoid accidental recursion
            self.comparer = function(compoundKeyA, compoundKeyB) {
                var primaryResult = oldComparer(compoundKeyA.primary, compoundKeyB.primary);
                if (primaryResult === 0) {
                    return newComparer(compoundKeyA.secondary, compoundKeyB.secondary);
                }
                return primaryResult;
            };

            return self;
        };

        var _reverse = function*(iter, a) {
            if (!a.done) {
                yield* _reverse(iter, iter.next());
                yield a.value;
            }
        };
        z.iterables.reverse = function(iter) {
            return function*() {
                var expandedIter = _expand(iter);
                yield* _reverse(expandedIter, expandedIter.next());
            };
        };

        z.iterables.select = function(iter, selector) {
            return function*() {
                for (var v of _expand(iter)) {
                    yield selector(v);
                }
            };
        };

        z.iterables.skip = function(iter, count) {
            return function*() {
                var a,
                    i = 0,
                    expandedIter = _expand(iter);
                while (!(a = expandedIter.next()).done && i < count) {
                    i++;
                }
                if (!a.done) {
                    yield a.value; // yield the value at the starting point
                    while(!(a = expandedIter.next()).done) {
                        yield a.value; // yield remaining values
                    }
                }
            }
        };

        z.iterables.sum = function(iter, selector) {
            // z.assert.isIterable(iter);
            var sum = 0;
            if (z.check.isFunction(selector)) {
                for (var v of iter) {
                    var num = selector(v);
                    if (z.check.isNumber(num)) {
                        sum += num;
                    }
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.isNumber(v)) {
                        sum += v;
                    }
                }
            }
            return sum;
        };

        z.iterables.take = function(iter, count) {
            return function*() {
                var i = 0;
                for (var v of _expand(iter)) {
                    if (count <= i++) {
                        break;
                    }
                    yield v;
                }
            };
        };

        z.iterables.toArray = function(iter) {
            return ([..._expand(iter)]);
        };

        z.iterables.where = function(iter, predicate) {
            return function*() {
                for (var v of _expand(iter)) {
                    if (predicate(v)) {
                        yield v;
                    }
                }
            };
        };

        z.iterables.zip = function(iter1, iter2, method) {
            return function*() {
                var a, b;
                var expandedIter1 = _expand(iter1);
                var expandedIter2 = _expand(iter2);
                while (!(a = expandedIter1.next()).done && !(b = expandedIter2.next()).done) {
                    yield method(a.value, b.value);
                }
            };
        };

        // wrapper class
        // this should be used whenever generator extensions are not being used
        // (HIGHLY SUGGESTED)
        var Iterable = (function() {
            function Iterable(iterable) {
                var self = this;
                if (z.check.isIterable(iterable))
                    self.data = iterable;
                else
                    return null;
                return self;
            }
            // prototype items can also go here
            return Iterable;
        }());

        // place helper method on the root
        z.from = function(iterable) {
            return new Iterable(iterable);
        };

        z.forEach(z.iterables, function(val) {
            // console.log(val);
            // consider trying to extend each Iterable.prototype dynamically (?)
        });

        Iterable.prototype[z.symbols.iterator] = function() {
            return _expand(this.data);
        };

        Iterable.prototype.aggregate = function(func, seed) {
            this.data = z.iterables.aggregate(this.data, func, seed);
            return this;
        };

        Iterable.prototype.any = function(predicate) {
            this.data = z.iterables.any(this.data, predicate);
            return this;
        };

        Iterable.prototype.concat = function(/* ... iter */) {
            var args = Array.prototype.slice.call(arguments);
            this.data = z.iterables.concat(this.data, ...args); // cant we just use ...arguments?
            return this;
        };

        Iterable.prototype.distinct = function(selector) {
            this.data = z.iterables.distinct(this.data, selector);
            return this;
        };

        Iterable.prototype.first = function(selector) {
            return z.iterables.first(this.data, selector);
        };

        Iterable.prototype.innerJoin = function(iter2) {
            this.data = z.iterables.innerJoin(this.data, iter2);
            return this;
        };

        Iterable.prototype.last = function(predicate) {
            return z.iterables.last(this.data, predicate);
        };

        Iterable.prototype.max = function(selector) {
            return z.iterables.max(this.data, selector);
        };

        Iterable.prototype.min = function(selector) {
            return z.iterables.min(this.data, selector);
        };

        Iterable.prototype.on = function(predicate) { 
            // extension to help with innerJoin
            // note that innerJoin MUST be called first. error trapping?
            this.data = this.data.on(predicate);
            return this;
        };
        
        Iterable.prototype.orderBy = function(selector, comparer) {
            this.data = z.iterables.orderBy(this.data, selector, comparer);
            return this;
        };

        Iterable.prototype.thenBy = function(selector, comparer) { 
            // extension to help with orderBy
            // note that orderBy MUST be called first. error trapping?
            this.data = this.data.thenBy(selector, comparer);
            return this;
        };

        Iterable.prototype.reverse = function() {
            this.data = z.iterables.reverse(this.data);
            return this;
        };

        Iterable.prototype.select = function(selector) {
            this.data = z.iterables.select(this.data, selector);
            return this;
        };

        Iterable.prototype.skip = function(count) {
            this.data = z.iterables.skip(this.data, count);
            return this;
        };

        Iterable.prototype.sum = function(selector) {
            this.data = z.iterables.sum(this.data, selector);
            return this;
        };

        Iterable.prototype.take = function(count) {
            this.data = z.iterables.take(this.data, count);
            return this;
        };

        Iterable.prototype.toArray = function() {
            if (z.check.isArray(this.data))
                return this.data;
            return z.iterables.toArray(this.data);
        };

        Iterable.prototype.where = function(predicate) {
            this.data = z.iterables.where(this.data, predicate);
            return this;
        };

        Iterable.prototype.zip = function(iter2, method) {
            this.data = z.iterables.where(this.data, iter2, method);
            return this;
        };

        z.classes.Iterable = Iterable; // put on classes in case users want to use new Iterable() instead of z.from
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof global !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory; });
        root.z = z; // expose to root in case require() is not being used to load zana
    }
    else if (typeof module !== 'undefined') {
        if (typeof module.exports !== 'undefined') {
            module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }
}());