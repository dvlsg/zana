/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

(function(z, undefined) {

    z.arrays = {};

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
    z.arrays.aggregate = function(/* source, func, seed */) {
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
    z.arrays.any = function(/* source, predicate */) {
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
    z.arrays.average = function(/* source, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        return z.arrays.sum(source, selector) / source.length;
    };

    /**
        Searches the array for items for a match for a given item.
        
        @this {Array}
        @param {any} item The item for which to search. or the predicate to use for matching.
        @param {function} [selector] The optional selector function used to select an item from the array for matching.
        @returns True if the item is found, else false.
    */
    z.arrays.contains = function(/* source, item, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var item = arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        if (selector == null) {
            for (var i = 0; i < source.length; i++) {
                if (z.equals(source[i], item)) {
                    return true;
                }
            }
        }
        else {
            selector = z.lambda(selector);
            for (var i = 0; i < source.length; i++) {
                if (z.equals(item, selector(source[i]))) {
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
    z.arrays.count = function(/* source, item, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var item = arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        var count = 0;
        if (selector == null) {
            for (var i = 0; i < source.length; i++) {
                if (z.equals(source[i], item)) {
                    count++;
                }
            }
        }
        else {
            selector = z.lambda(selector);
            for (var i = 0; i < source.length; i++) {
                if (z.equals(item, selector(source[i]))) {
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
    z.arrays.distinct = function(/* source, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        var result = [];
        if (selector == null) {
            for (var i = 0; i < source.length; i++) {
                if (!result.contains(source[i])) {
                    result.push(source[i]);
                }
            }
        }
        else {
            selector = z.lambda(selector);
            var keys = [];
            for (var i = 0; i < source.length; i++) {
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
    z.arrays.first = function(/* source, predicate */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        var source = this;
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

    /**
        Sets up two arrays of objects to be joined together.
        
        @this {array.<object>} The initial left array used for the inner join
        @param {array.<object>} [rightArray] The secondary right array used for the inner join.
        @returns {function} Returns an object containing the on method to be called after original inner join setup.
    */
    z.arrays.innerJoin = function(/* leftArray, rightArray */) {
        var argsIterator = 0;
        var leftArray = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var rightArray = arguments[argsIterator++];
        z.check.isNonEmptyArray(rightArray);
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
                            target.push(z.smash(leftArray[i], rightArray[k]));
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
    z.arrays.isEmpty = function(/* source */) {
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
    z.arrays.isFull = function(/* source */) {
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
    z.arrays.last = function(/* source, predicate */) {
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
    z.arrays.max = function(/* source, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        var maxValue = Number.MIN_VALUE;
        if (selector != null) {
            selector = z.lambda(selector);
            for (var i = 0; i < source.length; i++) {
                var selected = selector(source[i]);
                if (z.check.isNumber(selected) && maxValue < selected) {
                    maxValue = selected;
                }
            }
        }
        else {
            for (var i = 0; i < source.length; i++) {
                var selected = source[i];
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
        
        @this {Array}
        @param {string} [selector] A property name.
        @returns The minimum value of either the array itself, or the given property.
    */
    z.arrays.min = function(/* source, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        var minValue = Number.MAX_VALUE;
        if (selector != null) {
            selector = z.lambda(selector);
            for (var i = 0; i < source.length; i++) {
                var selected = selector(source[i]);
                if (z.check.isNumber(selected) && selected < minValue) {
                    minValue = selected;
                }
            }
        }
        else {
            for (var i = 0; i < source.length; i++) {
                var selected = source[i];
                if (z.check.isNumber(selected) && selected < minValue) {
                    minValue = selected;
                }
            }
        }
        return minValue;
    };

    /**
        Creates an deep copy of the original array of objects, ordered by the given key. 
        
        @this {Object[]}
        @param {function|string} selector The method or lambda string used to select a key by which to order.
        @param {function} [predicate] A predicate used to determine whether one object is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
    */
    z.arrays.orderBy = function(/* source, selector, predicate */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        selector = z.lambda(selector);
        predicate = predicate || function(x, y) {
            return ((selector(x) > selector(y)) ? 1 : (selector(x) < selector(y)) ? -1 : 0);
        }
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
    z.arrays.quicksort = function(/* source, predicate */) {
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
            }
        }
        var internalQuickSort = function(left, right) {
            do {
                var i = left;
                var j = right;
                var pivot = source[Math.floor((left + right) / 2)];
                do {
                    while ((i < source.length) && (predicate(source[i], pivot) < 0)) {
                        i++;
                    }
                    while ((0 <= j) && (predicate(pivot, source[j]) < 0)) {
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
        }
        internalQuickSort(0, this.length-1);
    };

    /**
        Sorts the original, given array in place 
        by using the quicksort algorithm with three-way partitioning.
        
        @this {Array}
        @param {string|function} [predicate] A predicate used to determine whether one item is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
    */
    z.arrays.quicksort3 = function(/* source, predicate */) {
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
            }
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
        }
        internalQuickSort(0, this.length-1);
    };

    /**
        Removes elements from an array based on a provided predicate.
        Traverses the array backwards, as it modifies the array which is currently being iterated.
         
        @this {array}
        @param {function|string} selector The method or lambda string used to determine element removal.
        @returns {void}
    */
    z.arrays.removeAll = function(/* source, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        var removalCount = 0;
        selector = z.lambda(selector);
        for (var i = source.length-1; i > -1; i--) {
            if (selector(source[i])) {
                source.splice(i, 1);
                removalCount++;
            }
        }
        return removalCount;
    };

    /**
        Projects a selected set of elements from an array of objects into a new array of new objects.
        
        @this {array}
        @param {(string|function|string[])} selectors A property name, function for selecting properties, or an array of property names.
        @returns {array} An array of objects, containing the properties specified by selectors.
    */
    z.arrays.select = function(/* source, selector */) {
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
        Takes and returns the items of the array
        starting at the provided index.
        
        @this {array}
        @param {number} index The index to start at.
        @returns {array} An array containing the taken items.
    */
    z.arrays.skip = function(/* source, index */) {
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
        Builds a summation of an array of numbers
        or a given numeric property for an array of objects.
        
        @this {array}
        @param {function|string} [selector] The method or lambda string used to select a property name for an array of objects.
        @returns A summation of either the array itself, or the given property.
    */
    z.arrays.sum = function(/* source, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        var sum = 0;
        if (selector != null) {
            selector = z.lambda(selector);
            for (var i = 0; i < source.length; i++) {
                var selection = selector(source[i]);
                if (z.check.isNumber(selection)) {
                    sum += selection;
                }
            }
        }
        else {
            for (var i = 0; i < source.length; i++) {
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
    z.arrays.swap = function(/* source, indexA, indexB */) {
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
    z.arrays.take = function(/* source, count */) {
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
    z.arrays.takeWhile = function(/* source, predicate */) {
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
        
        @this {array}
        @param {function} predicate A predicate used to determine whether or not to take an object on the array.
        @returns {array} A deep copied array of objects which match the predicate.
    */
    z.arrays.where = function(/* source, predicate */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        predicate = z.lambda(predicate);
        var source = this;
        var result = [];
        for (var i = 0; i < source.length; i++) {
            if (predicate(source[i])) {
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
    z.arrays.zip = function(/* arr1, arr2, method */) {
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
        Initializes all pre-defined methods
        as non-enumerable and non-writable properties
        located on the Array.prototype.
        
        @returns {void}
    */
    z.setup.initArrays = function(usePrototype) {
        if (!!usePrototype) {
            z.defineProperty(Array.prototype, "aggregate", { enumerable: false, writable: false, value: z.arrays.aggregate });
            z.defineProperty(Array.prototype, "any", { enumerable: false, writable: false, value: z.arrays.any });
            z.defineProperty(Array.prototype, "average", { enumerable: false, writable: false, value: z.arrays.average });
            z.defineProperty(Array.prototype, "contains", { enumerable: false, writable: false, value: z.arrays.contains });
            z.defineProperty(Array.prototype, "count", { enumerable: false, writable: false, value: z.arrays.count });
            z.defineProperty(Array.prototype, "deepCopy", { enumerable: false, writable: false, value: _deepCopy });
            z.defineProperty(Array.prototype, "distinct", { enumerable: false, writable: false, value: z.arrays.distinct });
            z.defineProperty(Array.prototype, "equals", { enumerable: false, writable: false, value: _equals });
            z.defineProperty(Array.prototype, "first", { enumerable: false, writable: false, value: z.arrays.first });
            z.defineProperty(Array.prototype, "innerJoin", { enumerable: false, writable: false, value: z.arrays.innerJoin });
            z.defineProperty(Array.prototype, "isEmpty", { enumerable: false, writable: false, value: z.arrays.isEmpty });
            z.defineProperty(Array.prototype, "isFull", { enumerable: false, writable: false, value: z.arrays.isFull });
            z.defineProperty(Array.prototype, "last", { enumerable: false, writable: false, value: z.arrays.last });
            z.defineProperty(Array.prototype, "max", { enumerable: false, writable: false, value: z.arrays.max });
            z.defineProperty(Array.prototype, "min", { enumerable: false, writable: false, value: z.arrays.min });
            z.defineProperty(Array.prototype, "orderBy", { enumerable: false, writable: false, value: z.arrays.orderBy });
            z.defineProperty(Array.prototype, "quicksort", { enumerable: false, writable: false, value: z.arrays.quicksort });
            z.defineProperty(Array.prototype, "quicksort3", { enumerable: false, writable: false, value: z.arrays.quicksort3 });
            z.defineProperty(Array.prototype, "removeAll", { enumerable: false, writable: false, value: z.arrays.removeAll });
            z.defineProperty(Array.prototype, "select", { enumerable: false, writable: false, value: z.arrays.select });
            z.defineProperty(Array.prototype, "skip", { enumerable: false, writable: false, value: z.arrays.skip });
            z.defineProperty(Array.prototype, "sum", { enumerable: false, writable: false, value: z.arrays.sum });
            z.defineProperty(Array.prototype, "swap", { enumerable: false, writable: false, value: z.arrays.swap });
            z.defineProperty(Array.prototype, "take", { enumerable: false, writable: false, value: z.arrays.take });
            z.defineProperty(Array.prototype, "takeWhile", { enumerable: false, writable: false, value: z.arrays.takeWhile });
            z.defineProperty(Array.prototype, "where", { enumerable: false, writable: false, value: z.arrays.where });
            z.defineProperty(Array.prototype, "zip", { enumerable: false, writable: false, value: z.arrays.zip });
        }
    };

}(zUtil.prototype));