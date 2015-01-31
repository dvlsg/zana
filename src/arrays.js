/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    "use strict";
    function factory(z) {

        var arrays = z.arrays = {};

        /**
            Performs the provided method on each element of array,
            using the previous result and the current item as
            arguments for the method.
            
            Note that we could really just use Array.prototype.reduce -- same thing.
            
            @this {array}
            @param {array} source The original array.
            @param {function} func A function used to return the result of an operation on the current element and previous result.
            @param {function} [seed] An optional seed to use as the the first argument with the first item in the array.
            @returns The result of the aggregate function on the array.
        */
        arrays.aggregate = function(/* source, func, seed */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var func = arguments[argsIterator++];
            var seed = arguments[argsIterator++];
            z.assert.isNonEmptyArray(source);
            var result;
            func = z.lambda(func);
            if (seed == null) {
                result = source[0];
            }
            else {
                result = func(seed, source[0]);
            }
            for (var i = 1; i < source.length; i++) {
                result = func(result, source[i]);
            }
            return result;
        };

        /**
            Searches the array for at least one item 
            which either exists, or matches a given predicate.
            
            @this {Array}
            @param {array} source The original array.
            @param {function} [predicate] A predicate used to find matches for the array. This function should return a truthy value.
            @returns True if at least one item is found which exists or matches the given predicate, else false.
        */
        arrays.any = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (predicate == null) {
                return source.length > 0;
            }
            predicate = z.lambda(predicate);
            for (var i = 0; i < source.length; i++) {
                if (predicate(source[i])) {
                    return true;
                }    
            }
            return false;
        };

        /**
            Collects the average of an array of numbers or a given numeric property for an array of objects.
            
            @this {Array}
            @param {string} [selector] A property name.
            @returns The average of either the array itself, or the given property.
        */
        arrays.average = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            return arrays.sum(source, selector) / source.length;
        };

        /**
            Searches the array for items for a match for a given item.
            
            @this {Array}
            @param {any} item The item for which to search. or the predicate to use for matching.
            @param {function} [selector] The optional selector function used to select an item from the array for matching.
            @returns True if the item is found, else false.
        */
        arrays.contains = function(/* source, item, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var item = arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var comparer;
            var i;
            if (z.check.isFunction(item)) 
                comparer = function(x) { return item(x); };
            else
                comparer = function(x, y) { return z.equals(x, y); };

            if (selector == null) {
                for (i = 0; i < source.length; i++) {
                    if (comparer(source[i], item)) {
                        return true;
                    }
                }
            }
            else {
                selector = z.lambda(selector);
                for (i = 0; i < source.length; i++) {
                    if (comparer(selector(source[i]), item)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
            Searches the array for items for matches for a given item.
            
            @this {Array}
            @param {any} item The item for which to search.
            @param {function} [selector] The optional selector function used to select an item from the array for matching.
            @returns The count of the matches found.
        */
        arrays.count = function(/* source, item, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var item = arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var count = 0;
            var comparer;
            var i;
            if (z.check.isFunction(item)) 
                comparer = function(x) { return item(x); };
            else
                comparer = function(x, y) { return z.equals(x, y); };

            if (selector == null) {
                for (i = 0; i < source.length; i++) {
                    if (comparer(source[i], item)) {
                        count++;
                    }
                } 
            }
            else {
                selector = z.lambda(selector);
                for (i = 0; i < source.length; i++) {
                    if (comparer(selector(source[i]), item)) {
                        count++;
                    }
                }
            }
            return count;
        };

        /**
            Builds a deep copy of the original array.
            To be used for the Array.prototype extension.

            @this {array} The array from which to build the deep copy.
            @returns {any} A deep copy of the original array.
            @throws {error} An error is thrown if the recursive object stack grows greater than 1000.
        */
        var _deepCopy = function() {
            return z.deepCopy(this);
        };

        /**
            Builds a compressed array from the original, containing only distinct items.
            If a selector is given, then uniqueness will be determined by 
            comparing the selected properties from objects on the array.
            
            @this {array}
            @param {string} [selector] A property name.
            @returns {array} A deep copied, distinct set of items.
        */
        arrays.distinct = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var result = [];
            var i;
            if (selector == null) {
                for (i = 0; i < source.length; i++) {
                    if (!result.contains(source[i])) {
                        result.push(source[i]);
                    }
                }
            }
            else {
                selector = z.lambda(selector);
                for (i = 0; i < source.length; i++) {
                    if (!result.contains(selector(source[i]), selector)) {
                        result.push(source[i]);
                    }
                }
            }
            return result;
        };

        /**
            Compares the equality of the original and a provided array.
            To be used for the Array.prototype extension.

            @this {array} The first array to compare.
            @param {array} arr2 The second array to compare.
            @returns {boolean} True if both arrays contain equal items, false if not.
            @throws {error} An error is thrown if the recursive function stack grows greater than 1000.
        */
        var _equals = function(arr2) {
            return z.equals(this, arr2);
        };

        /**
            Collects the first available value on the array
            optionally based on a given predicate. 
            
            @this {array} The array on which to search for a max value.
            @param {function} [predicate] The optional predicate used to find the first match.
            @returns {any} If no predicate is available, then the first item. If the predicate is available, the first item which matches.
        */
        arrays.first = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (predicate == null) {
                if (source.length > 0) {
                    return source[0];
                }
            }
            else {
                predicate = z.lambda(predicate);
                for (var i = 0; i < source.length; i++) {
                    if (predicate(source[i])) {
                        return source[i];
                    }
                }
            }
            return null;
        };

        var _flatten = function(input, output) {
            for (var i = 0; i < input.length; i++) {
                var current = input[i];
                if (!z.check.isArray(current))
                    output.push(current);
                else
                    _flatten(current, output);
            }
            return output;
        };

        arrays.flatten = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            return _flatten(source, []);
        };

        /**
            Sets up two arrays of objects to be joined together.
            
            @this {array.<object>} The initial left array used for the inner join
            @param {array.<object>} [rightArray] The secondary right array used for the inner join.
            @returns {function} Returns an object containing the on method to be called after original inner join setup.
        */
        arrays.innerJoin = function(/* leftArray, rightArray */) {
            var argsIterator = 0;
            var leftArray = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var rightArray = arguments[argsIterator++];
            // z.check.isNonEmptyArray(rightArray);
            return {
                /**
                    Joins two arrays of objects together based on a provided predicate.

                    @param {function} predicate The predicate used to find matches between the left and right arrays.
                    @returns {array.<object>} The inner joined collection of left and right arrays.
                */
                on: function(predicate) {
                    var target = [];
                    predicate = z.lambda(predicate);
                    for (var i = 0; i < leftArray.length; i++) {
                        z.check.isObject(leftArray[i]);
                        for (var k = 0; k < rightArray.length; k++) {
                            z.check.isObject(rightArray[k]);
                            if (predicate(leftArray[i], rightArray[k])) {
                                target.push(z.smash({}, leftArray[i], rightArray[k]));
                            }
                        }
                    }
                    return target;
                }
            };
        };

        /**
            Checks to see if an array is empty.
            
            @param {array} source The array to check for emptiness.
            @returns {boolean} True if the array contains no elements, or a combination of undefined or null elements, false if not.
        */
        arrays.isEmpty = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            if (source.length < 1) {
                return true;
            }
            for (var i = 0; i < source.length; i++) {
                if (z.check.exists(source[i])) {
                    return false;
                }
            }
            return true;
        };

        /**
            Checks to see if an array is full.
            
            @param {array} source The array to check for emptiness.
            @returns {boolean} True if the array contains no elements, or a combination of undefined or null elements, false if not.
        */
        arrays.isFull = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            if (source.length < 1) {
                return false;
            }
            for (var i = 0; i < source.length; i++) {
                if (!z.check.exists(source[i])) {
                    return false;
                }
            }
            return true;
        };

        /**
            Collects the last available value on the array
            optionally based on a given predicate. 
            
            @this {array} The array on which to search for a max value.
            @param {function} [predicate] The optional predicate used to find the last match.
            @returns {any} If no predicate is available, then the last item. If the predicate is available, the last item which matches.
        */
        arrays.last = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (predicate == null) {
                if (source.length > 0) {
                    return source[source.length-1];
                }
            }
            else {
                predicate = z.lambda(predicate);
                for (var i = source.length-1; 0 <= i; i--) {
                    if (predicate(source[i])) {
                        return source[i];
                    }
                }
            }
            return null;
        };

        /**
            Collects the maximum value of an array of numbers 
            or a given numeric property for an array of objects.
            
            @this {array} The array on which to search for a max value.
            @param {string} [selector] A property name.
            @returns The maximum value of either the array itself, or the given property.
        */
        arrays.max = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var maxValue = Number.MIN_VALUE;
            var selected;
            var i;
            if (selector != null) {
                selector = z.lambda(selector);
                for (i = 0; i < source.length; i++) {
                    selected = selector(source[i]);
                    if (z.check.isNumber(selected) && maxValue < selected) {
                        maxValue = selected;
                    }
                }
            }
            else {
                for (i = 0; i < source.length; i++) {
                    selected = source[i];
                    if (z.check.isNumber(selected) && maxValue < selected) {
                        maxValue = selected;
                    }
                }
            }
            return maxValue;
        };

        /**
            Collects the minimum value of an array of numbers 
            or a given numeric property for an array of objects.
            
            @param {array} source The source array from which to collect min value.
            @param {function} [selector] A selector function.
            @returns The minimum value of either the array itself, or the given property.
        */
        arrays.min = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var minValue = Number.MAX_VALUE;
            var selected;
            var i;
            if (selector != null) {
                selector = z.lambda(selector);
                for (i = 0; i < source.length; i++) {
                    selected = selector(source[i]);
                    if (z.check.isNumber(selected) && selected < minValue) {
                        minValue = selected;
                    }
                }
            }
            else {
                for (i = 0; i < source.length; i++) {
                    selected = source[i];
                    if (z.check.isNumber(selected) && selected < minValue) {
                        minValue = selected;
                    }
                }
            }
            return minValue;
        };

        /**
            Mutates the provided array based on a given mutator function.
            Each item of the array will be passed through the mutator function,
            setting the return from the mutator back to the original array index.
            
            @param {array} source The source array from which to collect min value.
            @param {function} mutator The mutator function.
            @returns A reference to the original (now mutated) array.
        */
        arrays.mutate = function(/* source, mutator */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var mutator = arguments[argsIterator++];
            mutator = z.lambda(mutator);
            if (z.check.isFunction(mutator)) {
                z.forEach(source, function(val, key) {
                    source[key] = mutator(source[key]);
                });
            }
            return source;
        };

        /**
            Creates an deep copy of the original array of objects, ordered by the given key. 
            
            @this {Object[]}
            @param {function|string} selector The method or lambda string used to select a key by which to order.
            @param {function} [predicate] A predicate used to determine whether one object is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
        */
        arrays.orderBy = function(/* source, selector, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            selector = z.lambda(selector);
            predicate = predicate || function(x, y) {
                return ((selector(x) > selector(y)) ? 1 : (selector(x) < selector(y)) ? -1 : 0);
            };
            var containsKey = source.where(function(obj) { return selector(obj) != null; });
            var missingKey = source.where(function(obj) { return selector(obj) == null; }); // don't bother sorting items with null or undefined keys
            containsKey.quicksort(predicate); 
            return containsKey.concat(missingKey);
        };

        /**
            Sorts the original, given array in place by using the quicksort algorithm.
            
            @this {Array}
            @param {string|function} [predicate] A predicate used to determine whether one item is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
        */
        arrays.quicksort = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (z.getType(predicate) === z.types.string) {
                predicate = z.lambda(predicate);
            }
            else {
                // dont accidentally take z.functions.identity - use this else statement
                predicate = predicate || function(x, y) {
                    return (x > y) ? 1 : ((x < y) ? -1 : 0);
                };
            }

            var comparer = function(x, y, xIndex, yIndex) {
                var c = predicate(x, y);
                if (c === 0)
                    return xIndex - yIndex;
                return c;
            };

            // more efficient to declare the internal call outside and just pass params around?
            // probably is -- more testing should be done here for optimization
            var internalQuickSort = function(left, right) {
                do {
                    var i = left;
                    var j = right;
                    var pivot = Math.floor((left + right) / 2);
                    var p = source[pivot];
                    do {
                        while ((i < source.length) && (comparer(source[i], p, i, pivot) < 0)) {
                            i++;
                        }
                        while ((0 <= j) && (comparer(p, source[j], pivot, j) < 0)) {
                            j--;
                        }
                        if (i > j) {
                            break; // left index has crossed right index, stop the loop
                        }
                        if (i < j) {
                            source.swap(i, j); // swap the indexes in the source
                        }
                        i++;
                        j--;
                    } while (i <= j);
                    if ((j - left) <= (right - i)) {
                        if (left < j) {
                            internalQuickSort(left, j);
                        }
                        left = i;
                    }
                    else {
                        if (i < right) {
                            internalQuickSort(i, right);
                        }
                        right = j;
                    }
                } while (left < right);
            };
            internalQuickSort(0, this.length-1);
        };

        /**
            Sorts the original, given array in place 
            by using the quicksort algorithm with three-way partitioning.
            
            @this {Array}
            @param {string|function} [predicate] A predicate used to determine whether one item is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
        */
        arrays.quicksort3 = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (z.getType(predicate) === z.types.string) {
                predicate = z.lambda(predicate);
            }
            else {
                // dont accidentally take z.functions.identity - use this else statement
                predicate = predicate || function(x, y) {
                    return (x > y) ? 1 : ((x < y) ? -1 : 0);
                };
            }
            var internalQuickSort = function(left, right) {
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
                    internalQuickSort(left, indexForLessThan-1);
                }
                if (indexForGreaterThan+1 < right) {
                    internalQuickSort(indexForGreaterThan+1, right);
                }
            };
            internalQuickSort(0, this.length-1);
        };

        /**
            Removes the first element from an array which matches a provided predicate.
             
            @param {array} source The source array from which to remove an element.
            @param {function} predicate The method used to determine element removal.
            @returns {array} The reference to the original array.
        */
        arrays.remove = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            predicate = z.lambda(predicate);
            for (var i = 0; i < source.length; i++) {
                if (predicate(source[i])) {
                    source.splice(i, 1);
                }
            }
            return source;
        };

        /**
            Removes elements from an array based on a provided predicate.
            Traverses the array backwards, as it modifies the array which is currently being iterated.
             
            @param {array} source The source array.
            @param {function|string} predicate The method or lambda string used to determine element removal.
            @returns {number} The count of removed items.
        */
        arrays.removeAll = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            var removalCount = 0;
            predicate = z.lambda(predicate);
            for (var i = source.length-1; i > -1; i--) {
                if (predicate(source[i])) {
                    source.splice(i, 1);
                    removalCount++;
                }
            }
            return removalCount;
        };

        /**
            Projects a selected set of elements from an array of objects into a new array of new objects.
            
            @param {array} source The source array.
            @param {(string|function|string[])} selectors A property name, function for selecting properties, or an array of property names.
            @returns {array} An array of objects, containing the properties specified by selectors.
        */
        arrays.select = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var result = [];
            selector = z.lambda(selector);
            for (var i = 0; i < source.length; i++) {
                result.push(selector(source[i]));
            }
            return result;
        };

        /**
            Shuffles an array using the Fisher-Yates algorithm.
            Note that the original array in the provided reference will be shuffled.

            @param {array} source The source array to be shuffled.
            @returns {array} source The shuffled array.
        */
        arrays.shuffle = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            for (var i = source.length-1; i >= 0; i--) {
                arrays.swap(source, i, Math.floor(Math.random() * i));
            }
            return source; // note that the original array will be shuffled -- return a reference to it anyways
        };

        /**
            Takes and returns the items of the array
            starting at the provided index.
            
            @param {array} source The source array over which to iterate.
            @param {number} index The index to start at.
            @returns {array} An array containing the taken items.
        */
        arrays.skip = function(/* source, index */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var index = arguments[argsIterator++];
            var result = [];
            if (index < 0) {
                index = 0; // consider logic for negative skips skipping items from the back
            }
            for (var i = 0; i < source.length - index && index <= source.length; i++) {
                result[i] = source[i+index];
            }
            return result;
        };

        /**
            Internal method for assistance with recursively building
            a set of subsets whose values all add up to the specified target.

            @param {array<number>} remaining The remaining unused values array for which to calculate a set of subsets.
            @param {number} target The target for each subset's sum.
            @param {array<number>} partial The array containing a potential subset of numbers whose sum adds to the target.
            @param {array<array<number>>} successes The reference to the array containing all successfully found subsets.
            @returns {array<array<number>>} The set of subsets.
        */
        function _internalSubsetSum(remaining, target, selector, partial, successes) {
            var s = partial.sum(selector);
            if (s === target) {
                successes.push(partial); // partial is a success!
                return; // found a success - end of path
            }
            if (s > target) {
                return; // too high - bad path
            }
            for (var i = 0; i < remaining.length; i++) {
                var newRemaining = [];
                var n = remaining[i];
                for (var j = i+1; j < remaining.length; j++) {
                    newRemaining.push(remaining[j]);
                }
                var newPartial = partial.deepCopy(); // will this be too inefficient? we could use slice for a shallow copy, if necessary
                newPartial.push(n);
                _internalSubsetSum(newRemaining, target, selector, newPartial, successes);
            }
            return successes;
        }

        /**
            Builds an array of arrays, notating a set of subsets
            whose values all add up to the specified target.

            @param {array<number>} source The source array for which to calculate a set of subsets.
            @param {number} target The target for each subset's sum.
            @returns {array<array<number>>} The set of subsets.
        */
        arrays.subsetSum = function(/* source, target, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var target = arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            if (!z.check.isFunction(selector)) {
                selector = z.functions.identity;
                // source = source.select(selector);
            }
            return _internalSubsetSum(source, target, selector, [], []);
        };

        /**
            Builds a summation of an array of numbers
            or a given numeric property for an array of objects.
            
            @this {array}
            @param {function|string} [selector] The method or lambda string used to select a property name for an array of objects.
            @returns A summation of either the array itself, or the given property.
        */
        arrays.sum = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var sum = 0;
            var i;
            if (selector != null) {
                selector = z.lambda(selector);
                for (i = 0; i < source.length; i++) {
                    var selection = selector(source[i]);
                    if (z.check.isNumber(selection)) {
                        sum += selection;
                    }
                }
            }
            else {
                for (i = 0; i < source.length; i++) {
                    if (z.check.isNumber(source[i])) {
                        sum += (source[i]);
                    }
                }
            }
            return sum;
        };

        /**
            Swaps two array items located at the provided indices.
            Note that the assertions can be dropped to improve performance.
            
            @this {array}
            @param {number} indexA The first index.
            @param {number} indexB The second index.
            @returns {void}
         */
        arrays.swap = function(/* source, indexA, indexB */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var indexA = arguments[argsIterator++];
            var indexB = arguments[argsIterator++];
            var temp = source[indexA];
            source[indexA] = source[indexB];
            source[indexB] = temp;
        };

        /**
            Takes the number of provided items from the array,
            starting at the first element.
            
            @this {array}
            @param {number} count The number of items to take.
            @returns {array} An array containing the taken items.
        */
        arrays.take = function(/* source, count */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var count = arguments[argsIterator++];
            var result = [];
            if (count < 0) {
                count = 0; // consider logic to allow negative count to count from the back of the array
            }
            for (var i = 0; i < count && i < source.length; i++) {
                result[i] = source[i];
            }
            return result;
        };

        /**
            Takes items from the array until
            the predicate no longer matches.
            
            @this {array}
            @param {function|string} predicate The method or lambda string used to determine when to halt collection from the source array.
            @returns {array} An array containing the taken items.
        */
        arrays.takeWhile = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            var result = [];
            predicate = z.lambda(predicate);
            for (var i = 0; i < count; i++) {
                if (!predicate(source[i])) break;
                result.push(source[i]);
            }
            return result;
        };

        /**
            Builds an array of objects from the original array which
            contains items that meet the conditions given by the predicate.

            Note that this is really the same thing as Array.filter.
            
            @this {array}
            @param {function} predicate A predicate used to determine whether or not to take an object on the array.
            @returns {array} A deep copied array of objects which match the predicate.
        */
        arrays.where = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            predicate = z.lambda(predicate);
            var result = [];
            for (var i = 0; i < source.length; i++) {
                if (predicate(source[i], i, source)) {
                    result.push(source[i]);
                }
            }
            return result;
        };

        /**
            Builds a new array by executing a provided method 
            with the provided two arrays and placing the result the new array.
            
            @param {arr1} array The first array to use for the zipping method.
            @param {arr2} array The second array to use for the zipping method.
            @param {method} method The method used to execute and return a result using items on both of the original arrays.
            @returns {array} An array with the zipped results.
        */
        arrays.zip = function(/* arr1, arr2, method */) {
            var argsIterator = 0;
            var arr1 = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var arr2 = arguments[argsIterator++];
            var method = arguments[argsIterator++];
            method = z.lambda(method);
            var source = this;
            var result = [];
            for (var i = 0; i < source.length; i++) {
                result.push(method(arr1[i], arr2[i]));
            }
            return result;
        };


        /**
            Places all array extensions on the provided object or prototype.

            @param {obj} object The object to be extended with array methods.
        */
        arrays.extendTo = function(obj) {
            z.defineProperty(obj, "aggregate", { enumerable: false, writable: true, value: arrays.aggregate });
            z.defineProperty(obj, "any", { enumerable: false, writable: true, value: arrays.any });
            z.defineProperty(obj, "average", { enumerable: false, writable: true, value: arrays.average });
            z.defineProperty(obj, "contains", { enumerable: false, writable: true, value: arrays.contains });
            z.defineProperty(obj, "count", { enumerable: false, writable: true, value: arrays.count });
            z.defineProperty(obj, "deepCopy", { enumerable: false, writable: true, value: _deepCopy });
            z.defineProperty(obj, "distinct", { enumerable: false, writable: true, value: arrays.distinct });
            z.defineProperty(obj, "equals", { enumerable: false, writable: true, value: _equals });
            z.defineProperty(obj, "first", { enumerable: false, writable: true, value: arrays.first });
            z.defineProperty(obj, "flatten", { enumerable: false, writable: true, value: arrays.flatten });
            z.defineProperty(obj, "innerJoin", { enumerable: false, writable: true, value: arrays.innerJoin });
            z.defineProperty(obj, "isEmpty", { enumerable: false, writable: true, value: arrays.isEmpty });
            z.defineProperty(obj, "isFull", { enumerable: false, writable: true, value: arrays.isFull });
            z.defineProperty(obj, "last", { enumerable: false, writable: true, value: arrays.last });
            z.defineProperty(obj, "max", { enumerable: false, writable: true, value: arrays.max });
            z.defineProperty(obj, "min", { enumerable: false, writable: true, value: arrays.min });
            z.defineProperty(obj, "mutate", { enumerable: false, writable: true, value: arrays.mutate });
            z.defineProperty(obj, "orderBy", { enumerable: false, writable: true, value: arrays.orderBy });
            z.defineProperty(obj, "quicksort", { enumerable: false, writable: true, value: arrays.quicksort });
            z.defineProperty(obj, "quicksort3", { enumerable: false, writable: true, value: arrays.quicksort3 });
            z.defineProperty(obj, "remove", { enumerable: false, writable: true, value: arrays.remove });
            z.defineProperty(obj, "removeAll", { enumerable: false, writable: true, value: arrays.removeAll });
            z.defineProperty(obj, "select", { enumerable: false, writable: true, value: arrays.select });
            z.defineProperty(obj, "shuffle", { enumerable: false, writable: true, value: arrays.shuffle });
            z.defineProperty(obj, "skip", { enumerable: false, writable: true, value: arrays.skip });
            z.defineProperty(obj, "subsetSum", { enumerable: false, writable: true, value: arrays.subsetSum });
            z.defineProperty(obj, "sum", { enumerable: false, writable: true, value: arrays.sum });
            z.defineProperty(obj, "swap", { enumerable: false, writable: true, value: arrays.swap });
            z.defineProperty(obj, "take", { enumerable: false, writable: true, value: arrays.take });
            z.defineProperty(obj, "takeWhile", { enumerable: false, writable: true, value: arrays.takeWhile });
            z.defineProperty(obj, "where", { enumerable: false, writable: true, value: arrays.where });
            z.defineProperty(obj, "zip", { enumerable: false, writable: true, value: arrays.zip });
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the Array.prototype.
            
            @returns {void}
        */
        z.setup.initArrays = function(usePrototype) {
            if (!!usePrototype)
                arrays.extendTo(Array.prototype);
        };
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