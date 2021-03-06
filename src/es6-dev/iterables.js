/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    "use strict";
    function factory(z) {

        var iterables = {};

        var _expand = function(iter) {
            // new firefox build removed the need for the explicit array check
            // ideally, this function would be entirely removed, 
            // but as of right now (12/29/2014) it would require generator extensions to be enabled
            
            // z.log(z.getType(iter));
            // if (iter)
                // z.log(iter.isGenerator);

            if (z.getType(iter) === z.types.function)
                return iter();

            if (iter && iter.isGenerator != null && iter.isGenerator())
                return iter(); // isGenerator() is a firefox-only thing. careful with this - not part of the ECMASCRIPT 6 spec!!
            // if (z.getType(iter) === z.types.array)
            //     return iter[Symbol.iterator](); 

            // if (iter && iter[Symbol.iterator] && z.check.isFunction(iter[Symbol.iterator]))
            //     return iter[Symbol.iterator]();
            return iter;
        };

        iterables.aggregate = function(iter, func, seed) {
            var result,
                expandedIter = _expand(iter);
            if (seed == null)
                result = expandedIter.next().value;
            else
                result = func(seed, expandedIter.next().value);
            for (var v of expandedIter)
                result = func(result, v);
            return result;
        };

        iterables.at = function(iter, index) {
            var type = z.getType(iter);
            switch (z.getType(iter)) {
                case z.types.array:
                    return iter[index]; // any other defaults?
                default:
                    for (var v of _expand(iter)) {
                        if (index-- === 0)
                            return v;
                    }
                    break;
            }
        };

        iterables.any = function(iter, predicate) {
            if (z.check.isFunction(predicate)) {
                for (var v of _expand(iter)) {
                    if (predicate(v))
                        return true;
                }
            }
            else {
                for (var v of _expand(iter)) {
                    if (v != null)
                        return true;
                }
            }
            return false;
        };

        iterables.average = function(iter, selector) {
            return iterables.sum(iter, selector) / iterables.length(iter);
        };

        iterables.concat = function(/* ... iter */) {
            // ES7 version of this? 
            var args = [...arguments];
            return function*() {
                for (var arg of args) {
                    for (var v of _expand(arg))
                        yield v;
                }
            };
        };

        iterables.contains = function(iter, item, selector) {
            // can't really use set.has() here, if we want z.equals to be used by default.
            var comparer;
            if (z.check.isFunction(item))
                comparer = function(x) { return item(x); };
            else
                comparer = function(x, y) { return z.equals(x, y); };
            if (selector == null || !z.check.isFunction(selector)) {
                for (var v of iter) {
                    if (comparer(v, item))
                        return true;
                }
            }
            else {
                for (var v of _expand(iter)) {
                    if (comparer(selector(v), item))
                        return true;
                }
            }
            return false;
        };

        iterables.crossJoin = function(iter1, iter2) {
            return function*() {
                for (var item1 of _expand(iter1)) {
                    for (var item2 of _expand(iter2)) {
                        // these if statements are quite a bit faster than flatten was.
                        if (item1[Symbol.iterator]) {
                            if (item2[Symbol.iterator])
                                yield [...item1, ...item2];
                            else
                                yield [...item1, item2];
                        }
                        else {
                            if (item2[Symbol.iterator])
                                yield [item1, ...item2];
                            else
                                yield [item1, item2];
                        }
                    }
                }
            }
        };

        iterables.distinct = function(iter, selector) {
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
                };
            }
        };

        iterables.first = function(iter, predicate) {
            iter = _expand(iter);
            if (z.check.isFunction(predicate)) {
                for (var v of iter) {
                    if (predicate(v))
                        return v;
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.exists(v))
                        return v;
                }
            }
            return null;
        };

        // this is bad for performance.
        // find a way around it?
        // start storing data as array by default?
        function* _flatten(iter) {
            if (!z.check.isIterable(iter))
                yield iter;
            else {
                for (var v of _expand(iter)) {
                    if (!z.check.isIterable(v)) // this will be a problem with anything other than objects.
                        yield v;
                    else
                        yield* _flatten(v);
                }
            }
        };
        iterables.flatten = function(iter) {
            return _flatten(iter);
        };

        // iterables.innerJoin = function(iter1, iter2) {
        //     return {
        //         on: function(predicate) {
        //             // // comprehension style (ES7) -- still slow, external comprehensions about 100x faster.
        //             // return (
        //             //     for (item1 of _expand(iter1))
        //             //     for (item2 of _expand(iter2))
        //             //     if (predicate(...iterables.flatten(item1), ...iterables.flatten(item2)))
        //             //     [item1, item2]
        //             // );
        //             // standard style. same performance, looks uglier.
        //             return function*() {
        //                 for (var item1 of _expand(iter1)) {
        //                     for (var item2 of _expand(iter2)) {
        //                         if (predicate(...iterables.flatten(item1), ...iterables.flatten(item2))) // this works
        //                             yield [item1, item2];
        //                     }
        //                 }
        //             }
        //         }
        //     };
        // };

        iterables.isEmpty = function(iter) {
            for (var v of _expand(iter))
                if (z.check.exists(v))
                    return false;
            return true;
        };

        iterables.isFull = function(iter) {
            for (var v of _expand(iter))
                if (!z.check.exists(v))
                    return false;
            return true;
        };

        iterables.join = function(iter1, iter2) {
            return function*() {
                for (var item1 of _expand(iter1)) {
                    for (var item2 of _expand(iter2)) {
                        var group = new Grouping();
                        if (item1 instanceof Grouping) {
                            if (item2 instanceof Grouping)
                                group.push(...item1, ...item2);
                            else
                                group.push(...item1, item2);
                        }
                        else {
                            if (item2 instanceof Grouping)
                                group.push(item1, ...item2);
                            else
                                group.push(item1, item2);
                        }
                        yield group;
                    }
                }
            };
        };

        iterables.last = function(iter, predicate) {
            // we will have to iterate over the entire iterable in the generic case
            // array has its own specific implementation for last, since we know the end
            var current,
                previous,
                result = null,
                expandedIter = _expand(iter);

            if (z.getType(iter) === z.types.array)
                return z.arrays.last(iter, predicate);
            if (z.check.isFunction(predicate)) {
                while (!(current = expandedIter.next()).done) {
                    if (predicate(current.value))
                        result = current.value;
                }
            }
            else {
                while (!(current = expandedIter.next()).done)
                    previous = current; // or we could just assign result = a.value -- could be less efficient.
                result = previous.value; // current will step "past" the end. previous will be the final.
            }
            return result;
        };

        iterables.length = function(iter) {
            // shortcut if we have array / set / map / etc
            if (iter.length && z.getType(iter.length) === z.types.number)
                return iter.length;
            var len = 0;
            for (var v of iter)
                len++;
            return len;
        };

        iterables.max = function(iter, selector) {
            var maxValue = Number.MIN_VALUE;
            if (z.check.isFunction(selector)) {
                for (var v of iter) {
                    var selected = selector(v);
                    if (z.check.isNumber(selected) && maxValue < selected)
                        maxValue = selected;
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.isNumber(v) && maxValue < v)
                        maxValue = v;
                }
            }
            return maxValue;
        };

        iterables.min = function(iter, selector) {
            var minValue = Number.MAX_VALUE;
            if (z.check.isFunction(selector)) {
                for (var v of iter) {
                    var selected = selector(v);
                    if (z.check.isNumber(selected) && selected < minValue)
                        minValue = selected;
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.isNumber(v) && v < minValue)
                        minValue = v;
                }
            }
            return minValue;
        };

        var buildMapArray = function(count) {
            var mapArray = new Array(count);
            for (var i = 0; i < count; i++)
                mapArray[i] = i;
            return mapArray;
        };
        var buildKeyArray = function(elements, selector, count) {
            var keyArray = new Array(count);
            for (var i = 0; i < count; i++)
                keyArray[i] = selector(elements[i]);
            return keyArray;
        };
        var quicksort3 = function(keyArray, mapArray, comparer, left, right) {
            var indexForLessThan = left;
            var indexForGreaterThan = right;
            var pivotIndex = mapArray[left];
            var indexForIterator = left+1;
            while (indexForIterator <= indexForGreaterThan) {
                var cmp = comparer(keyArray[mapArray[indexForIterator]], keyArray[pivotIndex]);
                if (cmp < 0)
                    z.arrays.swap(mapArray, indexForLessThan++, indexForIterator++);
                else if (0 < cmp)
                    z.arrays.swap(mapArray, indexForIterator, indexForGreaterThan--);
                else
                    indexForIterator++;
            }
            if (left < indexForLessThan-1)
                quicksort3(keyArray, mapArray, comparer, left, indexForLessThan-1);
            if (indexForGreaterThan+1 < right)
                quicksort3(keyArray, mapArray, comparer, indexForGreaterThan+1, right);
        };
        iterables.orderBy = function(iter, selector, comparer) {
            if (!z.check.isFunction(selector))
                selector = z.functions.identity;
            if (!z.check.exists(comparer))
                comparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

            var yielder = function*() {
                // only execute the sort on iteration
                // this is due to the possibly orderBy().thenBy().thenBy() chained calls
                var elements = (z.getType(iter) === z.types.generator ? iterables.toArray(iter) : iter);
                var unsortedElements = iterables.toArray(
                    iterables.where(elements, x => yielder.selector(x) == null)
                );
                var unsortedCount = unsortedElements.length;
                var sortedElements = iterables.toArray(
                    iterables.where(elements, x => yielder.selector(x) != null)
                );
                var sortedCount = sortedElements.length;
                var sortedKeys = buildKeyArray(sortedElements, yielder.selector, sortedCount);
                var sortedMap = buildMapArray(sortedCount);
                quicksort3(sortedKeys, sortedMap, yielder.comparer, 0, sortedCount-1);
                for (var i = 0; i < sortedCount; i++)
                    yield sortedElements[sortedMap[i]];
                for (var v of unsortedElements)
                    yield v;
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
                if (primaryResult === 0)
                    return newComparer(compoundKeyA.secondary, compoundKeyB.secondary);
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
        iterables.reverse = function(iter) {
            return function*() {
                var expandedIter = _expand(iter);
                yield* _reverse(expandedIter, expandedIter.next());
            };
        };

        iterables.select = function(iter, selector) {
            // // comprehension style (ES7) -- still slow, external comprehensions about 100x faster.
            // return (
            //     for (v of _expand(iter))
            //     selector(...iterables.flatten(v))
            // );

            // return function*() {
            //     for (var v of _expand(iter)) {
            //         if (v[Symbol.iterator])
            //             yield selector(...v);
            //         else
            //             yield selector(v);
            //     }
            // };

            // grouping version
            return function*() {
                for (var v of _expand(iter)) {
                    if (v instanceof Grouping)
                        yield selector(...v);
                    else 
                        yield selector(v);
                }
            };

            // original version
            // return function*() {
            //     for (var v of _expand(iter)) {
            //         yield selector(
            //             ...( // spread
            //                 iterables.flatten(v) // keep procedural as much as possible
            //             )
            //         );
            //     }
            // };
        };

        iterables.skip = function(iter, count) {
            return function*() {
                var a,
                    i = 0,
                    expandedIter = _expand(iter);
                while (!(a = expandedIter.next()).done && i < count)
                    i++;
                if (!a.done) {
                    yield a.value; // yield the value at the starting point
                    while(!(a = expandedIter.next()).done)
                        yield a.value; // yield remaining values
                }
            }
        };

        iterables.sum = function(iter, selector) {
            var sum = 0;
            if (z.check.isFunction(selector)) {
                for (var v of iter) {
                    var num = selector(v);
                    if (z.check.isNumber(num))
                        sum += num;
                }
            }
            else {
                for (var v of iter) {
                    if (z.check.isNumber(v))
                        sum += v;
                }
            }
            return sum;
        };

        iterables.take = function(iter, count) {
            return function*() {
                var i = 0;
                for (var v of _expand(iter)) {
                    if (count <= i++)
                        break;
                    yield v;
                }
            };
        };

        iterables.takeWhile = function(iter, predicate) {
            return function*() {
                for (var v of _expand(iter)) {
                    if (!predicate(v))
                        break;
                    yield v;
                }
            };
        };

        iterables.toArray = function(iter) {
            return ([..._expand(iter)]);
        };

        iterables.where = function(iter, predicate) {
            "use strict";
            // note - this gets crushed by generator comprehensions for performance
            // this gets crushed by plain comprehensions for performance
            // only real gain here is chainability with the other methods,
            // as well as the ability to execute a predicate which contains
            // additional logic (which may be an anti-pattern anyways).
            
            // grouping version
            return function*() {
                for (var v of _expand(iter)) {
                    if (v instanceof Grouping) {
                        if (predicate(...v))
                            yield v;
                    }
                    else {
                        if (predicate(v))
                            yield v;
                    }
                }
            };

            // // old version
            // return function*() {
            //     for (var v of _expand(iter)) {
            //         if (v[Symbol.iterator]) { // hacky? safe? its certainly faster.. worth losing safety for speed?
            //             if (predicate(...v))
            //                 yield v;
            //         }
            //         else {
            //             if (predicate(v))
            //                 yield v;
            //         }
            //     }
            // };
        };

        iterables.where_safe = function(iter, predicate) {
            "use strict";
            // note - this gets crushed by generator comprehensions for performance
            // this gets crushed by plain comprehensions for performance
            // only real gain here is chainability with the other methods,
            // as well as the ability to execute a predicate which contains
            // additional logic (which may be an anti-pattern anyways).
            return function*() {
                for (var v of _expand(iter)) {
                    if (predicate(v))
                        yield v;
                }
            };
        };

        iterables.zip = function(iter1, iter2, method) {
            return function*() {
                var a, b;
                var expandedIter1 = _expand(iter1);
                var expandedIter2 = _expand(iter2);
                while (!(a = expandedIter1.next()).done && !(b = expandedIter2.next()).done)
                    yield method(a.value, b.value);
            };
        };

        z.iterables = iterables;

        // wrapper class
        // this should be used whenever generator extensions are not being used
        // (HIGHLY SUGGESTED)
        var Iterable = (function() {
            function Iterable(iterable) {
                var self = this;
                if (z.check.isIterable(iterable))
                    // note that this sort of falls apart
                    // if the end user passes in an iterable of iterables
                    // (so an array of arrays, array of sets, etc)

                    // so here's the trade off.
                    // do we want joins with function parameter selection,
                    // or do we want users to use iterables of iterables as the source?
                    self.data = iterable;
                else
                    return null;
                return self;
            }
            // prototype items can also go here
            return Iterable;
        }());

        // this should take the place of the array being yielded
        // with multiple tables / data sets.
        // this is a slight performance hit 
        function Grouping() {}
        Grouping.prototype = new Array; // lovely "inherit" shenanigans

        


        // function* _prod(arrs, current, index) {
        //     if (index == arrs.length-1) {
        //         for (var v of arrs[index]) {
        //             current[index] = v;
        //             yield([...current]); // needs to be a copy, since
        //         }
        //     }
        //     else {
        //         for (var v of arrs[index]) {
        //             current[index] = v;
        //             yield* _prod(arrs, current, index+1);
        //         }
        //     }
        // }
        // function prod(...arrs) {
        //     return function*() {
        //         yield* _prod(arrs, [], 0);
        //     }
        // }

        // place helper method on the root
        z.from = function(iterable) {
            return new Iterable(iterable);
        };

        Iterable.prototype[Symbol.iterator] = function() {
            return _expand(this.data);
        };

        // this doesn't work yet,
        // since Symbol.toStringTag isn't available.
        // See: https://mail.mozilla.org/pipermail/es-discuss/2015-January/041149.html
        // Also see at 19.1.3.6.14: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
        Iterable.prototype['@@toStringTag'] = function() {
            z.log('hit tostringtag for iterable');
            return '[object Iterable]'; // for z.getType usage
        };

        Iterable.prototype.aggregate = function(func, seed) {
            this.data = iterables.aggregate(this.data, func, seed);
            return this;
        };

        Iterable.prototype.any = function(predicate) {
            return iterables.any(this.data, predicate);
        };

        Iterable.prototype.at = function(index) {
            return iterables.at(this.data, index);
        };

        Iterable.prototype.average = function(selector) {
            return iterables.average(this.data, selector);
        };

        Iterable.prototype.concat = function(/* ... iter */) {
            var args = Array.prototype.slice.call(arguments);
            this.data = iterables.concat(this.data, ...args); // cant we just use ...arguments?
            return this;
        };

        Iterable.prototype.crossJoin = function(iter2) {
            this.data = iterables.crossJoin(this.data, iter2);
            return this;
        };

        Iterable.prototype.contains = function(item, selector) {
            return iterables.contains(this.data, item, selector);
        };

        Iterable.prototype.distinct = function(selector) {
            this.data = iterables.distinct(this.data, selector);
            return this;
        };

        Iterable.prototype.first = function(selector) {
            return iterables.first(this.data, selector);
        };

        Iterable.prototype.flatten = function() {
            this.data = iterables.flatten(this.data);
            return this;
        };

        Iterable.prototype.innerJoin = function(iter2) {
            this.data = iterables.innerJoin(this.data, iter2);
            return this;
        };

        Iterable.prototype.isEmpty = function() {
            return iterables.isEmpty(this.data);
        };

        Iterable.prototype.isFull = function() {
            return iterables.isFull(this.data);
        };

        Iterable.prototype.join = function(iter2, predicate, selector) {
            // if (this.data instanceof Grouping)
            //     this.data.add(iter2);
            // else
            //     this.data = new Grouping(this.data, iter2);
            this.data = iterables.join(this.data, iter2);
            return this;
            // this.data = iterables.join(this.data, iter2, predicate, selector);
            // return this;
        };

        Iterable.prototype.last = function(predicate) {
            return iterables.last(this.data, predicate);
        };

        Iterable.prototype.leftJoin = function(iter2) {
            this.data = iterables.leftJoin(this.data, iter2);
            return this;
        };

        Iterable.prototype.max = function(selector) {
            return iterables.max(this.data, selector);
        };

        Iterable.prototype.min = function(selector) {
            return iterables.min(this.data, selector);
        };

        Iterable.prototype.on = function(predicate) { 
            // extension to help with innerJoin
            // note that innerJoin MUST be called first. error trapping?
            this.data = this.data.on(predicate);
            return this;
        };
        
        Iterable.prototype.orderBy = function(selector, comparer) {
            this.data = iterables.orderBy(this.data, selector, comparer);
            return this;
        };

        Iterable.prototype.thenBy = function(selector, comparer) { 
            // extension to help with orderBy
            // note that orderBy MUST be called first. error trapping?
            this.data = this.data.thenBy(selector, comparer);
            return this;
        };

        Iterable.prototype.reverse = function() {
            this.data = iterables.reverse(this.data);
            return this;
        };

        Iterable.prototype.select = function(selector) {
            this.data = iterables.select(this.data, selector);
            return this;
        };

        Iterable.prototype.skip = function(count) {
            this.data = iterables.skip(this.data, count);
            return this;
        };

        Iterable.prototype.sum = function(selector) {
            this.data = iterables.sum(this.data, selector);
            return this;
        };

        Iterable.prototype.take = function(count) {
            this.data = iterables.take(this.data, count);
            return this;
        };

        Iterable.prototype.toArray = function() {
            if (z.check.isArray(this.data))
                return this.data;
            return iterables.toArray(this.data);
        };

        Iterable.prototype.where = function(predicate) {
            this.data = iterables.where(this.data, predicate);
            return this;
        };

        Iterable.prototype.where_safe = function(predicate) {
            this.data = iterables.where_safe(this.data, predicate);
            return this;
        };

        Iterable.prototype.where2 = function(predicate) {
            this.data = iterables.where2(this.data, predicate);
            return this;
        };

        iterables.where2 = function*(iter, predicate) {
            // this is without a doubt the fastest
            // but we lose the ability to "join" other data sets.
            for (var v of _expand(iter)) {
                if (predicate(v))
                    yield v;
            }
        };

        Iterable.prototype.where3 = function(predicate) {
            this.data = iterables.where3(this.data, predicate);
            return this;
        };

        iterables.where3 = function*(iter, predicate) {
            for (var v of _expand(iter)) {
                if (predicate(...iterables.flatten(v)))
                    yield v;
            }
        };

        Iterable.prototype.where4 = function(predicate) {
            // this is the original, no flatten method.
            // is it worth keeping flatten for internal joins,
            // or should we just dump the idea of joins altogether?
            // we really need a more performant way to pull joins off,
            // if we are going to continue on with them.
            this.data = iterables.where4(this.data, predicate);
            return this;
        };

        iterables.where4 = function(iter, predicate) {
            return function*() {
                for (var v of _expand(iter)) {
                    if (predicate(v))
                        yield v;
                }
            };
        };

        Iterable.prototype.arraywhere = function(predicate) {
            // for performance checking reasons
            this.data = z.arrays.where(this.data, predicate);
            return this;
        };

        Iterable.prototype.zip = function(iter2, method) {
            this.data = iterables.where(this.data, iter2, method);
            return this;
        };

        Iterable.prototype.getType = function() {
            return '[object Iterable]'; // hacky fix until Symbol.toStringTag is available.
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