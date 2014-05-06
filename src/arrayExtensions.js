/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(w, undefined) {
    var z = w.util || {};

    // yield keyword wont work until ecmascript 6
    // z.AsEnumerable = function(source) {
    //     if (z.checkArgs(source)) {
    //         for (var i = 0; i < source.length; i++) {
    //             yield source[i];
    //         }
    //     }
    // }

    /**
        Performs the provided method on each element of array,
        using the previous result and the current item as
        arguments for the method.
        
        Note that we could really just use Array.prototype.reduce -- same thing.
        
        @this {array}
        @param {function} func A function used to return the result of an operation on the current element and previous result.
        @param {function} [seed] An optional seed to use as the the first argument with the first item in the array.
        @returns The result of the aggregate function on the array.
    */
    var aggregate = function(func, seed) {
        var source = this;
        z.check.exists(func);
        if (z.getType(func) === z.types.string) {
            func = z.lambda(func);
        }
        z.assert("() => this.length > 0");
        var result;
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
        @param {function} [predicate] A predicate used to find matches for the array. This function should return a truthy value.
        @returns True if at least one item is found which exists or matches the given predicate, else false.
    */
    var any = function(predicate) {
        var source = this;
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
    var average = function(selector) {
        var source = this;
        return source.sum(selector) / source.length;        
    };

    /**
        Searches the array for items for a match for a given item.
        
        @this {Array}
        @param {any} item The item for which to search. or the predicate to use for matching.
        @param {function} [selector] The optional selector function used to select an item from the array for matching.
        @returns True if the item is found, else false.
    */
    var contains = function(item, selector) {
        var source = this;
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
        Creates a deep copy of an original array.
        
        @this {Array}
        @returns A deep copy of the original array.
    */
    var deepCopy = function() {
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
    var distinct = function(selector) {
        var source = this;
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
        return result.deepCopy();
    };

    /**
        Determines the equality of two arrays.
        
        @this {Array}
        @param {Array} arr2 The second array to compare.
        @returns True if both arrays contain equal items, false if not.
    */
    var equals = function(arr2) {
        return z.equals(this, arr2);
    };

    /**
        Collects the first available value on the array
        optionally based on a given predicate. 
        
        @this {array} The array on which to search for a max value.
        @param {function} [predicate] The optional predicate used to find the first match.
        @returns {any} If no predicate is available, then the first item. If the predicate is available, the first item which matches.
    */
    var first = function(predicate) {
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
        Collects the last available value on the array
        optionally based on a given predicate. 
        
        @this {array} The array on which to search for a max value.
        @param {function} [predicate] The optional predicate used to find the last match.
        @returns {any} If no predicate is available, then the last item. If the predicate is available, the last item which matches.
    */
    var last = function(predicate) {
        var source = this;
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
    var max = function(selector) {
        var source = this;
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
    var min = function(selector) {
        var source = this;
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
    var orderBy = function(selector, predicate) {
        selector = z.lambda(selector);
        predicate = predicate || function(x, y) {
            return ((selector(x) > selector(y)) ? 1 : (selector(x) < selector(y)) ? -1 : 0);
        }
        var source = this;
        var containsKey = source.where(function(obj) { return selector(obj) != null; });
        var missingKey = source.where(function(obj) { return selector(obj) == null; }); // don't bother sorting items with null or undefined keys
        containsKey.quicksort(predicate); 
        return containsKey.concat(missingKey); // deep copy coming from .where
    };

    /**
        Sorts the original, given array in place by using the quicksort algorithm.
        
        @this {Array}
        @param {string|function} [predicate] A predicate used to determine whether one item is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
    */
    var quicksort = function(predicate) {
        var source = this;
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
        Sorts the original, given array in place by using the quicksort algorithm with three-way partitioning.
        
        @this {Array}
        @param {string|function} [predicate] A predicate used to determine whether one item is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
    */
    var quicksort3 = function(predicate) {
        var source = this;
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
    var removeAll = function(selector) {
        var source = this;
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
    var select = function(selector) {
        var source = this;
        var result = [];
        selector = z.lambda(selector);
        for (var i = 0; i < source.length; i++) {
            result.push(selector(source[i]));
        }
        return result.deepCopy();
    };

    /**
        Takes and returns the items of the array
        starting at the provided index.
        
        @this {array}
        @param {number} index The index to start at.
        @returns {array} An array containing the taken items.
    */
    var skip = function(index) {
        var source = this;
        z.assert(function() { return 0 < index && index <= source.length; });
        var result = [];
        for (var i = 0; i < source.length - index; i++) {
            result[i] = source[i+index];
        }
        return result.deepCopy();
    };

    /**
        Builds a summation of an array of numbers
        or a given numeric property for an array of objects.
        
        @this {array}
        @param {string} [selector] A property name.
        @returns A summation of either the array itself, or the given property.
    */
    var sum = function(selector) {
        var source = this;
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
    var swap = function(indexA, indexB) {
        var source = this;
        // z.check.isNumber(indexA);
        // z.check.isNumber(indexB);
        // z.assert(function() { return indexA >= 0; });
        // z.assert(function() { return indexB < source.length; });
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
    var take = function(count) {
        var source = this;
        z.assert(function() { return 0 < count && count <= source.length; });
        var result = [];
        for (var i = 0; i < count; i++) {
            result[i] = source[i];
        }
        return result.deepCopy();
    };

    /**
        Builds an array of objects from the original array which
        contains items that meet the conditions given by the predicate.
        
        @this {array}
        @param {function} predicate A predicate used to determine whether or not to take an object on the array. This function should return a truthy value.
        @returns {array} A deep copied array of objects which match the predicate.
     */
    var where = function(predicate) {
        predicate = z.lambda(predicate);
        var source = this;
        var result = [];
        for (var i = 0; i < source.length; i++) {
            if (predicate(source[i])) {
                result.push(source[i]);
            }
        }
        return result.deepCopy();
    };

    /**
        Initializes all pre-defined methods
        as non-enumerable and non-writable properties
        located on the Array.prototype.
        
        @returns {void}
    */
    (function() {
        z.defineProperty(Array.prototype, "aggregate", { enumerable: false, writable: false, value: aggregate });
        z.defineProperty(Array.prototype, "any", { enumerable: false, writable: false, value: any });
        z.defineProperty(Array.prototype, "average", { enumerable: false, writable: false, value: average });
        z.defineProperty(Array.prototype, "contains", { enumerable: false, writable: false, value: contains });
        z.defineProperty(Array.prototype, "deepCopy", { enumerable: false, writable: false, value: deepCopy });
        z.defineProperty(Array.prototype, "distinct", { enumerable: false, writable: false, value: distinct });
        z.defineProperty(Array.prototype, "equals", { enumerable: false, writable: false, value: equals });
        z.defineProperty(Array.prototype, "first", { enumerable: false, writable: false, value: first });
        z.defineProperty(Array.prototype, "last", { enumerable: false, writable: false, value: last });
        z.defineProperty(Array.prototype, "max", { enumerable: false, writable: false, value: max });
        z.defineProperty(Array.prototype, "min", { enumerable: false, writable: false, value: min });
        z.defineProperty(Array.prototype, "orderBy", { enumerable: false, writable: false, value: orderBy });
        z.defineProperty(Array.prototype, "quicksort", { enumerable: false, writable: false, value: quicksort });
        z.defineProperty(Array.prototype, "quicksort3", { enumerable: false, writable: false, value: quicksort3 });
        z.defineProperty(Array.prototype, "removeAll", { enumerable: false, writable: false, value: removeAll });
        z.defineProperty(Array.prototype, "select", { enumerable: false, writable: false, value: select });
        z.defineProperty(Array.prototype, "skip", { enumerable: false, writable: false, value: skip });
        z.defineProperty(Array.prototype, "sum", { enumerable: false, writable: false, value: sum });
        z.defineProperty(Array.prototype, "swap", { enumerable: false, writable: false, value: swap });
        z.defineProperty(Array.prototype, "take", { enumerable: false, writable: false, value: take });
        z.defineProperty(Array.prototype, "where", { enumerable: false, writable: false, value: where });
    })();

    w.util = z;
}(window || this));