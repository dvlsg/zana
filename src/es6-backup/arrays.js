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
        return z.iterables.aggregate(source, func, seed);
    };

    /**
        Searches the array for at least one item 
        which either exists, or matches a given predicate.
        
        @param {array} source The original array.
        @param {function} [predicate] A predicate used to find matches for the array. This function should return a truthy value.
        @returns True if at least one item is found which exists or matches the given predicate, else false.
    */
    z.arrays.any = function(/* source, predicate */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        return z.iterables.any(source, predicate);
    };

    /**
        Returns a generator function representation of the original array.
        
        @param {Array} source The original array.
        @returns {GeneratorFunction} The generator function representation of the original array.
    */
    z.arrays.asEnumerable = function(/* source */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        z.assert.isArray(source);
        return function*() {
            for (var i = 0; i < source.length; i++) {
                yield source[i];
            }
        };
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

        // TODO: convert to iterable function

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

        // TODO: convert to iterable function

        if (z.check.isFunction(selector)) {
            for (var i = 0; i < source.length; i++) {
                if (z.equals(item, selector(source[i]))) {
                    return true;
                }
            }
        }
        else {
            for (var i = 0; i < source.length; i++) {
                if (z.equals(item, source[i])) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
        Builds a deep copy of the original array.
        To be used for the Array.prototype extension.

        @this {array} The array from which to build the deep copy.
        @returns {any} A deep copy of the original array.
        @throws {error} An error is thrown if the recursive object stack grows greater than 1000.
    */
    // var _deepCopy = function() {
    //     return z.deepCopy(this);
    // };
    z.arrays.deepCopy = function(/* source */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        return z.deepCopy(source);
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
        return z.iterables.distinct(source, selector);
        

        // var result = [];

        // if (z.check.isFunction(selector)) {
        //     var keys = [];
        //     for (var i = 0; i < source.length; i++) {
        //         if (!result.contains(selector(source[i]), selector)) {
        //             result.push(source[i]);
        //         }
        //     }
        // }
        // else {
        //     for (var i = 0; i < source.length; i++) {
        //         if (!result.contains(source[i])) {
        //             result.push(source[i]);
        //         }
        //     }
        // }
        // return result;
    };

    /**
        Compares the equality of the original and a provided array.
        To be used for the Array.prototype extension.

        @this {array} The first array to compare.
        @param {array} arr2 The second array to compare.
        @returns {boolean} True if both arrays contain equal items, false if not.
        @throws {error} An error is thrown if the recursive function stack grows greater than 1000.
    */
    // var _equals = function(arr2) {
    //     return z.equals(this, arr2);
    // };
    z.arrays.equals = function(/* arr1, arr2 */) {
        var argsIterator = 0;
        var arr1 = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var arr2 = arguments[argsIterator++];
        return z.equals(arr1, arr2);
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
        return z.iterables.first(source, predicate);
    };

    /**
        Fills a provided array with a random set of integers
        between the provided min and max values.
        
        @this {array} The array on which to search for a max value.
        @param {number} min The minimum integer to generate.
        @param {number} max The maximum integer to generate.
        @returns {void}
    */
    z.arrays.fillRandom = function(/* source, min, max */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var min = arguments[argsIterator++];
        var max = arguments[argsIterator++];
        z.assert.isArray(source);
        z.assert.isNumber(min);
        z.assert.isNumber(max);
        for (var i = 0; i < source.length; i++) {
            source[i] = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    /**
        Generates a new array with a random set of integers
        between the provided min and max values.
        
        @param {number} size The size of the array to generate.
        @param {number} min The minimum integer to generate.
        @param {number} max The maximum integer to generate.
        @returns {array} The generated array.
    */
    z.arrays.getRandom = function(size, min, max) {
        z.assert.isNumber(size);
        z.assert.isNumber(min);
        z.assert.isNumber(max);
        var result = new Array(size);
        z.arrays.fillRandom(result, min, max);
        return result;
    };

    /**
        Sets up two arrays of objects to be joined together.
        
        @this {array.<object>} The initial left array used for the inner join
        @param {array.<object>} [rightArray] The secondary right array used for the inner join.
        @returns {function} Returns an object containing the on method to be called after original inner join setup.
    */
    z.arrays.innerJoin = function(/* leftArray, rightArray */) {
        var argsIterator = 0;
        var leftArray = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
        var rightArray = arguments[argsIterator++];
        return z.iterables.innerJoin(leftArray, rightArray);
    };

    /**
        Collects the last available value on the array
        optionally based on a given predicate.
        Note: Keeping the array specific implementation
        for performance reasons.
        
        @this {array} The array on which to search for a max value.
        @param {function} [predicate] The optional predicate used to find the last match.
        @returns {any} If no predicate is available, then the last item. If the predicate is available, the last item which matches.
    */
    z.arrays.last = function(/* source, predicate */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        if (z.check.isFunction(predicate)) {
            for (var i = source.length-1; 0 <= i; i--) {
                if (predicate(source[i])) {
                    return source[i];
                }
            }
        }
        else {
            if (source.length > 0) {
                return source[source.length-1];
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
        return z.iterables.max(source, selector);
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
        return z.iterables.min(source, selector);
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
        return z.iterables.orderBy(source, selector, predicate);
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
        if (!z.check.exists(predicate)) {
            predicate = predicate || ((x, y) => x > y ? 1 : x < y ? -1 : 0);
        }
        var internalQuickSort = function(left, right) { // should move this externally to prevent recreation on each quicksort
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
        if (!(z.check.exists(predicate) && z.check.isFunction(predicate))) {
            predicate = predicate || ((x, y) => x > y ? 1 : x < y ? -1 : 0);
        }
        var internalQuickSort = function(left, right) { // should move this externally to prevent recreation on each quicksort
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
        if (z.check.isFunction(selector)) {
            for (var i = source.length-1; i > -1; i--) {
                if (selector(source[i])) {
                    source.splice(i, 1);
                    removalCount++;
                }
            }
        }
        else {
            for (var i = source.length-1; i > -1; i--) {
                if (z.equals(selector, source[i])) {
                    source.splice(i, 1);
                    removalCount++;
                }
            }
        }
        return removalCount;
    };

    /**
        Projects a selected set of elements from an array into a generator of selected items.
        
        @param {Array} source An array of items. 
        @param {Function} selector A function used to select properties from the original item.
        @returns {GeneratorFunction} A generator containing the selected items.
    */
    z.arrays.select = function(/* source, selector */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var selector = arguments[argsIterator++];
        return z.iterables.select(source, selector);
    };

    /**
        Takes and returns the items of the array
        starting at the provided index.
        
        @this {array}
        @param {number} index The index to start at.
        @returns {array} An array containing the taken items.

        Yields items from the array starting from the provided index.
        
        @param {Array} source An array. 
        @param {Number} index The index from which to start.
        @returns {GeneratorFunction} A generator containing any items past the provided index.
    */
    z.arrays.skip = function(/* source, index */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        var index = arguments[argsIterator++];
        return z.iterables.skip(source, index);
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
        return z.iterables.sum(source, selector);
    };

    /**
        Swaps two array items located at the provided indices.
        Note that the assertions can be dropped to improve performance.

        Consider having two versions to improve performance 
        (one for the z.arrays version and one for the prototype)
        
        @this {array} source The array.
        @param {number} indexA The first index.
        @param {number} indexB The second index.
        @returns {void}
     */
    var _swap = function(indexA, indexB) {
        var temp = this[indexA];
        this[indexA] = this[indexB];
        this[indexB] = temp;
    };
    z.arrays.swap = function(source, indexA, indexB) {
        //var argsIterator = 0;
        //var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
        //var indexA = arguments[argsIterator++];
        //var indexB = arguments[argsIterator++];
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
        return z.iterables.take(source, count);
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
        // predicate = z.lambda(predicate);
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
        return z.iterables.where(source, predicate);
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
        return z.iterables.zip(arr1, arr2, method);
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

            // asEnumerable missing from web
            z.defineProperty(Array.prototype, "asEnumerable", { enumerable: false, writable: false, value: z.arrays.asEnumerable });

            z.defineProperty(Array.prototype, "average", { enumerable: false, writable: false, value: z.arrays.average });
            z.defineProperty(Array.prototype, "contains", { enumerable: false, writable: false, value: z.arrays.contains });

            // missing count

            z.defineProperty(Array.prototype, "deepCopy", { enumerable: false, writable: false, value: z.arrays.deepCopy });
            z.defineProperty(Array.prototype, "distinct", { enumerable: false, writable: false, value: z.arrays.distinct });
            z.defineProperty(Array.prototype, "equals", { enumerable: false, writable: false, value: z.arrays.equals });
            z.defineProperty(Array.prototype, "first", { enumerable: false, writable: false, value: z.arrays.first });

            // fillrandom missing from web
            z.defineProperty(Array.prototype, "fillRandom", { enumerable: false, writable: false, value: z.arrays.fillRandom });

            z.defineProperty(Array.prototype, "innerJoin", { enumerable: false, writable: false, value: z.arrays.innerJoin });

            // missing isEmpty
            // missing isFull
            
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
            z.defineProperty(Array.prototype, "swap", { enumerable: false, writable: false, value: _swap }); // use internal method for performance
            z.defineProperty(Array.prototype, "take", { enumerable: false, writable: false, value: z.arrays.take });
            z.defineProperty(Array.prototype, "takeWhile", { enumerable: false, writable: false, value: z.arrays.takeWhile });
            z.defineProperty(Array.prototype, "where", { enumerable: false, writable: false, value: z.arrays.where });
            z.defineProperty(Array.prototype, "zip", { enumerable: false, writable: false, value: z.arrays.zip });
        }
    };

}(zUtil.prototype));