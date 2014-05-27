/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

(function(z, undefined) {

    z.iterables = {};

    var _expand = function(iter) {
        // note: this is not needed with the hackish Object.defineProperty of iterator symbol on GeneratorFunctionPrototype
        if (iter && iter.isGenerator && iter.isGenerator()) {
            return iter();
        }
        // z.assert.isGeneratorFunction(possibleGenerator);
        return iter;
    };

    z.iterables.aggregate = function(iter, func, seed) {
        z.assert.isIterable(iter);
        z.assert.isFunction(func);
        var result;
        iter = _expand(iter);
        if (seed == null) {
            result = iter.next().value;
        }
        else {
            result = func(seed, iter.next().value);
        }
        for (var v of iter) {
            result = func(result, v)
        }
        return result;
    };

    z.iterables.any = function(iter, predicate) {
        z.assert.isIterable(iter);
        if (z.check.isFunction(predicate)) {
            for (var v of iter) {
                if (predicate(v)) {
                    return true;
                }
            }
        }
        else {
            for (var v of iter) {
                if (v != null) {
                    return true;
                }
            }
        }
        return false;
    };

    z.iterables.concat = function(/* ... iter */) {
        var args = Array.prototype.slice.call(arguments);
        return function*() {
            for (var arg of args) {
                for (var v of arg) {
                    yield v;
                }
            }
        }
    };

    z.iterables.first = function(iter, predicate) {
        z.assert.isIterable(iter);
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
        z.assert.isIterable(iter1);
        z.assert.isIterable(iter2);
        return {
            on: function(predicate) {
                z.assert.isFunction(predicate);
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
        };
    };

    z.iterables.max = function(iter, selector) {
        z.assert.isIterable(iter);
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
        z.assert.isIterable(iter);
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

    var _buildMapArray = function(count) {
        var mapArray = new Array(count);
        for (var i = 0; i < count; i++) {
            mapArray[i] = i;
        }
        return mapArray;
    };
    var _buildKeyArray = function(elements, selector) {
        var keyArray = new Array(elements.length);
        for (var i = 0; i < elements.length; i++) {
            keyArray[i] = selector(elements[i]);
        };
    };
    var _quicksort3 = function(keyArray, mapArray, left, right) {
        var indexForLessThan = left;
        var indexForGreaterThan = right;
        var pivot = source[left];
        var indexForIterator = left+1;
        while (indexForIterator <= indexForGreaterThan) {
            var cmp = predicate(source[indexForIterator], pivot);
            if (cmp < 0) {
                source.swap(indexForLessThan++, indexForIterator++);
            }
            else if (cmp > 0) {
                source.swap(indexForIterator, indexForGreaterThan--);
            }
            else {
                indexForIterator++;
            }
        }
        if (left < indexForLessThan-1) {
            _quicksort3(left, indexForLessThan-1);
        }
        if (indexForGreaterThan+1 < right) {
            _quicksort3(indexForGreaterThan+1, right);
        }
    }
    z.iterables.orderBy = function() {

        z.assert.isIterable(iter);
        if (!z.check.exists(selector))
            selector = z.functions.identity;

        if (!z.check.exists(comparer))
            comparer = (x,y) => selector(x) > selector(y) ? 1 : selector(x) < selector(y) ? -1 : 0;

        var _mapArray;
        var _elements = iter.toArray();
        var _mapArray = _buildMapArray(_elements.length);
        var _keyArray = _buildKeyArray(_elements, selector);


    };

    var _reverse = function*(iter, a) {
        if (!a.done) {
            yield* _reverse(iter, iter.next());
            yield a.value;
        }
    };
    z.iterables.reverse = function(iter) {
        z.assert.isIterable(iter);
        return function*() {
            iter = _expand(iter);
            yield* _reverse(iter, iter.next());
        };
    };

    z.iterables.toArray = function(iter) {
        z.assert.isIterable(iter);
        var result = [];
        for (var v of iter) {
            result.push(v);
        }
        return result;
    };

    z.iterables.where = function(iter, predicate) {
        z.assert.isIterable(iter);
        z.assert.isFunction(predicate);
        return function*() {
            for (var v of iter) {
                if (predicate(v)) {
                    yield v;
                }
            }
        };
    };

    z.iterables.zip = function(iter1, iter2, method) {
        z.assert.isIterable(iter1);
        z.assert.isIterable(iter2);
        return function*() {
            var a, b;
            iter1 = _expand(iter1);
            iter2 = _expand(iter2);
            while (!(a = iter1.next()).done && !(b = iter2.next()).done) {
                yield method(a.value, b.value);
            }
        };
    };

}(zUtil.prototype));