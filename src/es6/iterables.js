/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

(function(z, undefined) {

    z.iterables = {};

    var _expand = function(iter) {
        if (iter && iter.isGenerator != null && iter.isGenerator()) {
            return iter();
        }
        return iter;
    };

    z.iterables.aggregate = function(iter, func, seed) {
        z.assert.isIterable(iter);
        z.assert.isFunction(func);
        var result,
            expandedIter = _expand(iter);
        if (seed == null) {
            result = expandedIter.next().value;
        }
        else {
            result = func(seed, expandedIter.next().value);
        }
        for (var v of expandedIter) {
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
        z.log(keyArray);
        return keyArray;
    };
    var quicksort3 = function(keyArray, mapArray, comparer, left, right) {
        var indexForLessThan = left;
        var indexForGreaterThan = right;
        var pivotIndex = mapArray[left];
        var indexForIterator = left+1;
        while (indexForIterator <= indexForGreaterThan) {
            var cmp = comparer(keyArray[mapArray[indexForIterator]], keyArray[pivotIndex]);
            // z.log("cmp: " + cmp + "  left: " + keyArray[mapArray[indexForIterator]] + "  right: " + keyArray[pivotIndex]);
            if (cmp < 0) {
                mapArray.swap(indexForLessThan++, indexForIterator++);
            }
            else if (0 < cmp) {
                mapArray.swap(indexForIterator, indexForGreaterThan--);
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
        z.assert.isIterable(iter);

        if (!z.check.isFunction(selector))
            selector = z.functions.identity;
        if (!z.check.exists(comparer))
            comparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

        // z.log(iter.toArray());
        // for (var v of iter.toArray()) {
        //     z.log(v);
        // }
        // z.log(selector.toString());
        // z.log(comparer);
        
        z.log(iter.toArray());
        z.log(iter.toArray());
        // var unsortedElements = z.iterables.where(iter, x => selector(x) == null).toArray();
        var unsortedElements = iter.where(x => selector(x) == null).toArray();
        var unsortedCount = unsortedElements.length;
        
        var sortElements = iter.where(x => selector(x) != null).toArray(); // iter.toArray();
        // var sortElements = z.iterables.where(iter, x => selector(x) != null).toArray(); // iter.toArray();
        var sortCount = sortElements.length;
        var sortKeys = buildKeyArray(sortElements, selector, sortCount);
        var sortMap = buildMapArray(sortCount);
        quicksort3(sortKeys, sortMap, comparer, 0, sortCount-1);

        z.log(unsortedElements);
        z.log(sortElements);
        return function*() {
            for (var i = 0; i < sortCount; i++) {
                yield sortElements[sortMap[i]];
            }
            for (var v of unsortedElements) {
                yield v;
            }
        };
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
            var expandedIter = _expand(iter);
            yield* _reverse(expandedIter, expandedIter.next());
        };
    };

    z.iterables.skip = function(iter, count) {
        z.assert.isIterable(iter);
        return function*() {
            var a,
                i = 0,
                expandedIter = _expand(iter);
            while (!(a = expandedIter.next()).done && i < count) {
                i++;
            }
            if (!a.done) {
                while(!(a = expandedIter.next()).done) {
                    yield a.value;
                }
            }
            
        }
    };

    z.iterables.take = function(iter, count) {
        z.assert.isIterable(iter);
        return function*() {
            var i = 0;
            for (var v of iter) {
                if (count === i++) {
                    break;
                }
                yield v;
            }
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
            var expandedIter1 = _expand(iter1);
            var expandedIter2 = _expand(iter2);
            while (!(a = expandedIter1.next()).done && !(b = expandedIter2.next()).done) {
                yield method(a.value, b.value);
            }
        };
    };

}(zUtil.prototype));