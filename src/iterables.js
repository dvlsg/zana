/* eslint no-unused-vars: 0, no-trailing-spaces: 0, no-use-before-define: 0 */

/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

let slice = Array.prototype.slice;

let die = process.exit.bind(process);

let log = function() {
    let args = slice.call(arguments);
    console.log.apply(console, args);
};

function buildMapArray(count) {
    let mapArray = new Array(count);
    for (let i = 0; i < count; i++)
        mapArray[i] = i;
    return mapArray;
}

function buildKeyArray(elements, selector, count) {
    let keyArray = new Array(count);
    for (let i = 0; i < count; i++)
        keyArray[i] = selector(elements[i]);
    return keyArray;
}

function quicksort3(keyArray, mapArray, comparer, left, right) {
    let indexForLessThan    = left;
    let indexForGreaterThan = right;
    let pivotIndex          = mapArray[left];
    let indexForIterator    = left + 1;
    while (indexForIterator <= indexForGreaterThan) {
        let cmp = comparer(keyArray[mapArray[indexForIterator]], keyArray[pivotIndex], mapArray[indexForIterator], mapArray[pivotIndex]);
        if (cmp < 0)
            swap(mapArray, indexForLessThan++, indexForIterator++);
        else if (cmp > 0)
            swap(mapArray, indexForIterator, indexForGreaterThan--);
        else
            indexForIterator++;
    }
    if (left < indexForLessThan - 1)
        quicksort3(keyArray, mapArray, comparer, left, indexForLessThan - 1);
    if (indexForGreaterThan + 1 < right)
        quicksort3(keyArray, mapArray, comparer, indexForGreaterThan + 1, right);
}

function compareKeys(comparer, keys, i1, i2) {
    let k1 = keys[i1];
    let k2 = keys[i2];
    let c = comparer(k1, k2);
    if (c === 0)
        return i1 - i2;
    return c;
}

function swap(arr, a, b) {
    [arr[a], arr[b]] = [arr[b], arr[a]];
}

function quicksort(keys, map, comparer, left, right) {
    do {
        let i = left;
        let j = right;
        let x = map[i + ((j - i) >> 1)];
        let p = keys[x];
        do {
            while (i < map.length && compareKeys(comparer, keys, x, map[i]) > 0)
                i++;
            while (j >= 0 && compareKeys(comparer, keys, x, map[j]) < 0)
                j--;
            if (i > j)
                break; // left index has crossed right index, stop the loop
            if (i < j)
                [map[i], map[j]] = [map[j], map[i]]; // does this work?
                // swap(map, i, j); // swap the indexes in the map
            i++;
            j--;
        } while (i <= j);
        if (j - left <= right - i) {
            if (left < j)
                quicksort(keys, map, comparer, left, j);
            left = i;
        }
        else {
            if (i < right)
                quicksort(keys, map, comparer, i, right);
            right = j;
        }
    } while (left < right);
}

// export class Iterables {

//     constructor({ check, util }) {
//         this.check = check;
//         this.util  = util;
//     }

//     from(data: any) {
//         console.log('this:', this);
//         return new Iterable(data, this);
//     }

//     expand(iter: any) {
//         if (iter && typeof iter === 'function')
//             return iter();
//         if (iter && iter[Symbol.iterator] && typeof iter[Symbol.iterator] === 'function')
//             return iter[Symbol.iterator]();
//         return iter;
//     }

//     orderBy(
//           iter
//         , selector = (x)    => x
//         , comparer = (x, y) => x > y ? 1 : x < y ? -1 : 0
//     ) {
//         // if (!check.isFunction(selector))
//         //     selector = x => x;
//         // if (!check.exists(comparer))
//         //     comparer = (x,y) => x > y ? 1 : x < y ? -1 : 0;
//         return new OrderedIterable(iter, selector, comparer); // reference to this(?)
//     }

//     toArray(iter: any) {
//         log('Iterables.toArray');
//         let arr = [];
//         for (let v of this.expand(iter))
//             arr.push(v);
//         return arr;
//         // return ([...this.expand(iter)]);
//     }

//     where(iter: any, predicate: Function) {
//         // es6 doesn't allow arrows to be generators. sad day. use the self/this trick to get at .expand
//         let self = this;
//         return function*() {
//             let expanded = self.expand(iter);
//             for (let v of expanded) {
//                 if (predicate(v))
//                     yield v;
//             }
//         };
//     }
// }

export default class Iterable {
    data: any;

    constructor(data) {
        this.data = data;
    }

    static from(data) {
        return new Iterable(data);
    }

    static expand(iter: any) {
        if (iter && typeof iter === 'function') // really need typeof generatorFunction..
            return iter();
        // if (iter && iter[Symbol.iterator] && typeof iter[Symbol.iterator] === 'function')
        //     return iter[Symbol.iterator]();
        return iter;
    }

    [Symbol.toStringTag]() {
        return '[object Iterable]';
    }

    [Symbol.iterator]() {
        // log('Iterable Symbol.iterator');
        // log('iterating over this.data:', this.data);
        return Iterable.expand(this.data)[Symbol.iterator](); // covers arrays, sets, generator functions, generators..
    }

    aggregate(
          func: Function = (x) => x
        , seed: any = null
    ): any {
        let iter = this[Symbol.iterator]();
        let result = null;
        if (seed === null)
            result = iter.next().value; // what about empty iterables?
        else
            result = func(seed, iter.next().value);
        for (let v of iter)
            result = func(result, v);
        return result;
    }

    at(index: number): any {
        if (Array.isArray(this.data))
            return this.data[index];
        for (let v of this) {
            if (index-- === 0)
                return v;
        }
    }

    any(predicate: any = null): boolean {
        if (predicate && typeof predicate === 'function') {
            for (let v of this) {
                if (predicate(v))
                    return true;
            }
        }
        else {
            for (let v of this) {
                if (v != null)
                    return true;
            }
        }
        return false;
    }

    concat(...args): Iterable {
        let iters = [Iterable.expand(this.data)];
        for (let arg of args) {
            if (arg instanceof Iterable) // a bit hacky... but functional. need to make sure we can use iter.concat(iter)
                iters.push(Iterable.expand(arg.data));
            else
                iters.push(arg);
        }
        this.data = function*() {
            for (let iter of iters) {
                for (let v of iter)
                    yield v;
            }
        };
        return this;
    }

    join(...args): MultiIterable {
        return new MultiIterable(this, ...args);
    }

    length() {
        // shortcut if we have array / set / map / etc
        if (this.data.length)
            return this.data.length;
        let len = 0;
        for (let v of this)
            len++;
        return len;
    }

    orderBy(
          selector   : Function = (x)    => x
        , comparer   : Function = (x, y) => x > y ? 1 : x < y ? -1 : 0
        , descending : boolean  = false
    ): OrderedIterable
    {
        return new OrderedIterable(this, selector, comparer, descending);
    }

    orderByDescending(
          selector : Function = (x)    => x
        , comparer : Function = (x, y) => x > y ? 1 : x < y ? -1 : 0
    ): OrderedIterable
    {
        return new OrderedIterable(this, selector, comparer, true);
    }

    // orderBy(selector: Function, comparer: Function) {
    //     return this.iterables.orderBy(this.data, selector, comparer);
    //     // this.data = iterables.orderBy(this.data, selector, comparer);
    //     // log('orderBy:', this.data);
    //     // for (let v of this.data) {
    //     //     log('v:', v);
    //     // }
    //     // return this;
    // }

    select(selector: Function = (x) => x): Iterable {
        let data = this.data; // expand needs to be internal in this case.
        this.data = function*() {
            for (let v of Iterable.expand(data))
                yield selector(v);
        };
        return this;
    }

    toArray(): Array {
        //// option 1
        // return Array.from(this);

        //// option 2
        // if (Array.isArray(this.data))
        //     return this.data;
        // return [...this];

        //// option 3
        let arr = [];
        for (let v of this)
            arr.push(v);
        return arr;
    }

    where(predicate: Function = (x) => x): Iterable {
        let data = this.data;
        this.data = function*() {
            for (let v of Iterable.expand(data)) {
                if (predicate(v))
                    yield v;
            }
        };
        return this;
    }
}

export class MultiIterable extends Iterable {

    iterables: Array<Iterable>;
    data: Array<Iterable>; // does extending even make sense? sort of cheating...

    constructor(...args) {
        super(); // cheating.. sort of..
        this.iterables = [];
        this.join(...args);
    }

    static from(...args) {
        return new MultiIterable(...args);
    }

    [Symbol.toStringTag]() {
        return '[object MultiIterable]';
    }

    // [Symbol.iterator]() {
    //     /*
    //         given iterables = [
    //               [1,2,3]
    //             , [4,5,6]
    //             , [7,8,9]
    //         ],
    //         the desired output is:
    //             [1,4,7]
    //             [1,4,8]
    //             [1,4,9]
    //             [1,5,7]
    //             [1,5,8]
    //             [1,5,9]
    //             etc, etc.
    //     */

    //     // consider just converting all iters to arrays,
    //     // so we don't need to worry about backtracking across already iterated arrays,
    //     // or perhaps some sort of inline-array building by iter index

    //     // right now, just converting all iters to arrays
    //     let expanded = [];
    //     for (let iter of this.iterables)
    //         expanded.push(Array.from(Iterable.expand(iter)));
    //     function* iterate(index, accumulate) {
    //         // log(`${index}): ${accumulate}`);
    //         if (accumulate.length < expanded.length) {
    //             for (let v of expanded[index]) {
    //                 accumulate.push(v);
    //                 yield* iterate(index + 1, accumulate);
    //             }
    //         }
    //         else
    //             yield Array.from(accumulate); // make a copy
    //         accumulate.pop(); // base and recursive case both need to pop
    //     }

    //     // kick off the recursion
    //     // or do we want to return a new Iterable

    //     let iterable = new Iterable(function*() {
    //         for (let v of iterate(0, []))
    //             yield v;
    //     });

    //     this.data = iterable;
    //     return this.data[Symbol.iterator]();

    //     // return iterable[Symbol.iterator]();


    //     // return Iterable.expand(function*() {
    //     //     for (let v of iterate(0, []))
    //     //         yield v;
    //     // });
    // }


    /*
        need to be able to chain .join calls
        as a result, we need to keep a running list of iterables which have been joined,
        but only access them whenever this.data is used (iteration over Iterable)

        examples:

        new Iterable([1,2,3])
            .join([4,5,6])
            .join([7,8,9]);

        OR new Iterable([1,2,3])
            .join([4,5,6], [7,8,9]);

        OR new MultiIterable([1,2,3], [4,5,6], [7,8,9])

        the desired yields are:
            [1,4,7]
            [1,4,8]
            [1,4,9]
            [1,5,7]
            [1,5,8]
            [1,5,9]
            ...
            [3,6,7]
            [3,6,8]
            [3,6,9]
    */
    join(...args) {
        for (let v of args)
            this.iterables.push(v); // keep a running list of iterables, only use them when this.data is iterated over
        let self = this;
        this.data = function*() {
            let expanded = [];
            for (let iter of self.iterables)
                expanded.push(Array.from(Iterable.expand(iter)));
            function* iterate(index, accumulate) {
                // log(`${index}): ${accumulate}`);
                if (accumulate.length < expanded.length) {
                    for (let v of expanded[index]) {
                        accumulate.push(v);
                        yield* iterate(index + 1, accumulate);
                    }
                }
                else
                    yield Array.from(accumulate); // make a copy
                accumulate.pop(); // base and recursive case both need to pop
            }
            yield* iterate(0, []);
        };
        return this;
    }
}

export class OrderedIterable extends Iterable {

    comparer   : Function;
    selector   : Function;
    descending : boolean;
    toSort     : any;

    constructor(
          data       : any
        , selector   : Function
        , comparer   : Function
        , descending : boolean
    ) {
        super();
        // log('OrderedIterable constructor');
        this.selector = selector;
        this.comparer = comparer;
        this.toSort = data; // keep a separate pointer to the data to be sorted, we need to change this.data on each orderBy/thenBy call
        this.update();
    }

    [Symbol.toStringTag]() {
        return '[object OrderedIterable]';
    }

    // find a better name for this (and possibly a better spot. static?)
    // it is being re-used by constructor, and thenBy, so it should be a function somewhere
    update() {
        let self = this;
        this.data = function*() {
            let elements = [...Iterable.expand(self.toSort)]; // dangerous? inefficient? seems like it.
            let unsortedElements = elements.filter(x => self.selector(x) == null);
            let unsortedCount = unsortedElements.length;
            let sortableElements = elements.filter(x => self.selector(x) != null);
            let sortedCount = sortableElements.length;
            let sortedKeys = buildKeyArray(sortableElements, self.selector, sortedCount);
            let sortedMap = buildMapArray(sortedCount);

            // todo: something with descending.
            quicksort(sortedKeys, sortedMap, self.comparer, 0, sortedCount - 1);
            for (let i = 0; i < sortedCount; i++) 
                yield sortableElements[sortedMap[i]];
            for (let v of unsortedElements)
                yield v;
        };
        return self;
    }

    // [Symbol.iterator]() {
    //     let self = this;
    //     let yielder = function*() {
    //         let elements = [...Iterable.expand(self.data)]; // dangerous? inefficient? seems like it.
    //         let unsortedElements = elements.filter(x => self.selector(x) == null);
    //         let unsortedCount = unsortedElements.length;
    //         let sortableElements = elements.filter(x => self.selector(x) != null);
    //         let sortedCount = sortableElements.length;
    //         let sortedKeys = buildKeyArray(sortableElements, self.selector, sortedCount);
    //         let sortedMap = buildMapArray(sortedCount);
    //         quicksort(sortedKeys, sortedMap, self.comparer, 0, sortedCount - 1);
    //         for (let i = 0; i < sortedCount; i++) 
    //             yield sortableElements[sortedMap[i]];
    //         for (let v of unsortedElements)
    //             yield v;
    //     };
    //     return Iterable.expand(yielder);
    // }

    thenBy(
          newSelector = (x)    => x
        , newComparer = (x, y) => (x > y ? 1 : x < y ? -1 : 0)
    ): OrderedIterable
    {
        let self = this;

        // wrap the old selector in a new selector function
        // which will build all keys into a primary/secondary structure,
        // allowing the primary key selector to grow recursively
        // by appending new selectors on to the original selectors
        let oldSelector = self.selector; // store pointer to avoid accidental recursion
        self.selector = function(item) {
            return {
                primary   : oldSelector(item),
                secondary : newSelector(item)
            };
        };

        // wrap the old comparer in a new comparer function
        // which will carry on down the line of comparers
        // in order until a non-zero is found, 
        // or until we reach the last comparer
        let oldComparer = self.comparer; // store pointer to avoid accidental recursion
        self.comparer = function(compoundKeyA, compoundKeyB) {
            let primaryResult = oldComparer(compoundKeyA.primary, compoundKeyB.primary);
            if (primaryResult === 0) // ensure stability
                return newComparer(compoundKeyA.secondary, compoundKeyB.secondary);
            return primaryResult;
        };
        this.update();
        return self;
    }
}


//         iterables.average = function(iter, selector) {
//             return iterables.sum(iter, selector) / iterables.length(iter);
//         };

//         iterables.contains = function(iter, item, selector) {
//             // can't really use set.has() here, if we want z.equals to be used by default.
//             var comparer;
//             if (z.check.isFunction(item))
//                 comparer = function(x) { return item(x); };
//             else
//                 comparer = function(x, y) { return z.equals(x, y); };
//             if (selector == null || !z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     if (comparer(v, item))
//                         return true;
//                 }
//             }
//             else {
//                 for (var v of _expand(iter)) {
//                     if (comparer(selector(v), item))
//                         return true;
//                 }
//             }
//             return false;
//         };

//         iterables.crossJoin = function(iter1, iter2) {
//             return function*() {
//                 for (var item1 of _expand(iter1)) {
//                     for (var item2 of _expand(iter2)) {
//                         // these if statements are quite a bit faster than flatten was.
//                         if (item1[Symbol.iterator]) {
//                             if (item2[Symbol.iterator])
//                                 yield [...item1, ...item2];
//                             else
//                                 yield [...item1, item2];
//                         }
//                         else {
//                             if (item2[Symbol.iterator])
//                                 yield [item1, ...item2];
//                             else
//                                 yield [item1, item2];
//                         }
//                     }
//                 }
//             }
//         };

//         iterables.distinct = function(iter, selector) {
//             var seen = [];
//             if (z.check.isFunction(selector)) {
//                 return function*() {
//                     for (var v of iter) {
//                         var key = selector(v);
//                         if (!seen.contains(key)) {
//                             seen.push(key);
//                             yield v;
//                         }
//                     }
//                 };
//             }
//             else {
//                 return function*() {
//                     for (var v of iter) {
//                         if (!seen.contains(v)) {
//                             seen.push(v);
//                             yield v; // this works too. may be more efficient?
//                         }
//                     }
//                 };
//             }
//         };

//         iterables.first = function(iter, predicate) {
//             iter = _expand(iter);
//             if (z.check.isFunction(predicate)) {
//                 for (var v of iter) {
//                     if (predicate(v))
//                         return v;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.exists(v))
//                         return v;
//                 }
//             }
//             return null;
//         };

//         // this is bad for performance.
//         // find a way around it?
//         // start storing data as array by default?
//         function* _flatten(iter) {
//             if (!z.check.isIterable(iter))
//                 yield iter;
//             else {
//                 for (var v of _expand(iter)) {
//                     if (!z.check.isIterable(v)) // this will be a problem with anything other than objects.
//                         yield v;
//                     else
//                         yield* _flatten(v);
//                 }
//             }
//         };
//         iterables.flatten = function(iter) {
//             return _flatten(iter);
//         };

//         // iterables.innerJoin = function(iter1, iter2) {
//         //     return {
//         //         on: function(predicate) {
//         //             // // comprehension style (ES7) -- still slow, external comprehensions about 100x faster.
//         //             // return (
//         //             //     for (item1 of _expand(iter1))
//         //             //     for (item2 of _expand(iter2))
//         //             //     if (predicate(...iterables.flatten(item1), ...iterables.flatten(item2)))
//         //             //     [item1, item2]
//         //             // );
//         //             // standard style. same performance, looks uglier.
//         //             return function*() {
//         //                 for (var item1 of _expand(iter1)) {
//         //                     for (var item2 of _expand(iter2)) {
//         //                         if (predicate(...iterables.flatten(item1), ...iterables.flatten(item2))) // this works
//         //                             yield [item1, item2];
//         //                     }
//         //                 }
//         //             }
//         //         }
//         //     };
//         // };

//         iterables.isEmpty = function(iter) {
//             for (var v of _expand(iter))
//                 if (z.check.exists(v))
//                     return false;
//             return true;
//         };

//         iterables.isFull = function(iter) {
//             for (var v of _expand(iter))
//                 if (!z.check.exists(v))
//                     return false;
//             return true;
//         };

//         iterables.join = function(iter1, iter2) {
//             return function*() {
//                 for (var item1 of _expand(iter1)) {
//                     for (var item2 of _expand(iter2)) {
//                         var group = new Grouping();
//                         if (item1 instanceof Grouping) {
//                             if (item2 instanceof Grouping)
//                                 group.push(...item1, ...item2);
//                             else
//                                 group.push(...item1, item2);
//                         }
//                         else {
//                             if (item2 instanceof Grouping)
//                                 group.push(item1, ...item2);
//                             else
//                                 group.push(item1, item2);
//                         }
//                         yield group;
//                     }
//                 }
//             };
//         };

//         iterables.last = function(iter, predicate) {
//             // we will have to iterate over the entire iterable in the generic case
//             // array has its own specific implementation for last, since we know the end
//             var current,
//                 previous,
//                 result = null,
//                 expandedIter = _expand(iter);

//             if (z.getType(iter) === z.types.array)
//                 return z.arrays.last(iter, predicate);
//             if (z.check.isFunction(predicate)) {
//                 while (!(current = expandedIter.next()).done) {
//                     if (predicate(current.value))
//                         result = current.value;
//                 }
//             }
//             else {
//                 while (!(current = expandedIter.next()).done)
//                     previous = current; // or we could just assign result = a.value -- could be less efficient.
//                 result = previous.value; // current will step "past" the end. previous will be the final.
//             }
//             return result;
//         };

//         iterables.length = function(iter) {
//             // shortcut if we have array / set / map / etc
//             if (iter.length && z.getType(iter.length) === z.types.number)
//                 return iter.length;
//             var len = 0;
//             for (var v of iter)
//                 len++;
//             return len;
//         };

//         iterables.max = function(iter, selector) {
//             var maxValue = Number.MIN_VALUE;
//             if (z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     var selected = selector(v);
//                     if (z.check.isNumber(selected) && maxValue < selected)
//                         maxValue = selected;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.isNumber(v) && maxValue < v)
//                         maxValue = v;
//                 }
//             }
//             return maxValue;
//         };

//         iterables.min = function(iter, selector) {
//             var minValue = Number.MAX_VALUE;
//             if (z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     var selected = selector(v);
//                     if (z.check.isNumber(selected) && selected < minValue)
//                         minValue = selected;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.isNumber(v) && v < minValue)
//                         minValue = v;
//                 }
//             }
//             return minValue;
//         };

//         var buildMapArray = function(count) {
//             var mapArray = new Array(count);
//             for (var i = 0; i < count; i++)
//                 mapArray[i] = i;
//             return mapArray;
//         };
//         var buildKeyArray = function(elements, selector, count) {
//             var keyArray = new Array(count);
//             for (var i = 0; i < count; i++)
//                 keyArray[i] = selector(elements[i]);
//             return keyArray;
//         };
//         var quicksort3 = function(keyArray, mapArray, comparer, left, right) {
//             var indexForLessThan = left;
//             var indexForGreaterThan = right;
//             var pivotIndex = mapArray[left];
//             var indexForIterator = left+1;
//             while (indexForIterator <= indexForGreaterThan) {
//                 var cmp = comparer(keyArray[mapArray[indexForIterator]], keyArray[pivotIndex]);
//                 if (cmp < 0)
//                     z.arrays.swap(mapArray, indexForLessThan++, indexForIterator++);
//                 else if (0 < cmp)
//                     z.arrays.swap(mapArray, indexForIterator, indexForGreaterThan--);
//                 else
//                     indexForIterator++;
//             }
//             if (left < indexForLessThan-1)
//                 quicksort3(keyArray, mapArray, comparer, left, indexForLessThan-1);
//             if (indexForGreaterThan+1 < right)
//                 quicksort3(keyArray, mapArray, comparer, indexForGreaterThan+1, right);
//         };
//         iterables.orderBy = function(iter, selector, comparer) {
//             if (!z.check.isFunction(selector))
//                 selector = z.functions.identity;
//             if (!z.check.exists(comparer))
//                 comparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

//             var yielder = function*() {
//                 // only execute the sort on iteration
//                 // this is due to the possibly orderBy().thenBy().thenBy() chained calls
//                 var elements = (z.getType(iter) === z.types.generator ? iterables.toArray(iter) : iter);
//                 var unsortedElements = iterables.toArray(
//                     iterables.where(elements, x => yielder.selector(x) == null)
//                 );
//                 var unsortedCount = unsortedElements.length;
//                 var sortedElements = iterables.toArray(
//                     iterables.where(elements, x => yielder.selector(x) != null)
//                 );
//                 var sortedCount = sortedElements.length;
//                 var sortedKeys = buildKeyArray(sortedElements, yielder.selector, sortedCount);
//                 var sortedMap = buildMapArray(sortedCount);
//                 quicksort3(sortedKeys, sortedMap, yielder.comparer, 0, sortedCount-1);
//                 for (var i = 0; i < sortedCount; i++)
//                     yield sortedElements[sortedMap[i]];
//                 for (var v of unsortedElements)
//                     yield v;
//                 return;
//             };

//             z.defineProperty(yielder, "thenBy", { enumerable: false, writable: true, configurable: true, value: thenBy.bind(yielder) });
//             z.defineProperty(yielder, "selector", { enumerable: false, writable: true, configurable: true, value: selector });
//             z.defineProperty(yielder, "comparer", { enumerable: false, writable: true, configurable: true, value: comparer });
//             return yielder;
//         };

//         var thenBy = function(newSelector, newComparer) {
//             var self = this;
//             if (!z.check.isFunction(newComparer))
//                 newComparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

//             // wrap the old selector in a new selector function
//             // which will build all keys into a primary/secondary structure,
//             // allowing the primary key selector to grow recursively
//             // by appending new selectors on to the original selectors
//             var oldSelector = self.selector; // store pointer to avoid accidental recursion
//             self.selector = function(item) {
//                 return {
//                     primary: oldSelector(item),
//                     secondary: newSelector(item)
//                 }
//             };

//             // wrap the old comparer in a new comparer function
//             // which will carry on down the line of comparers
//             // in order until a non-zero is found, or until
//             // we reach the new comparer
//             var oldComparer = self.comparer; // store pointer to avoid accidental recursion
//             self.comparer = function(compoundKeyA, compoundKeyB) {
//                 var primaryResult = oldComparer(compoundKeyA.primary, compoundKeyB.primary);
//                 if (primaryResult === 0)
//                     return newComparer(compoundKeyA.secondary, compoundKeyB.secondary);
//                 return primaryResult;
//             };

//             return self;
//         };

//         var _reverse = function*(iter, a) {
//             if (!a.done) {
//                 yield* _reverse(iter, iter.next());
//                 yield a.value;
//             }
//         };
//         iterables.reverse = function(iter) {
//             return function*() {
//                 var expandedIter = _expand(iter);
//                 yield* _reverse(expandedIter, expandedIter.next());
//             };
//         };

//         iterables.select = function(iter, selector) {
//             // // comprehension style (ES7) -- still slow, external comprehensions about 100x faster.
//             // return (
//             //     for (v of _expand(iter))
//             //     selector(...iterables.flatten(v))
//             // );

//             // return function*() {
//             //     for (var v of _expand(iter)) {
//             //         if (v[Symbol.iterator])
//             //             yield selector(...v);
//             //         else
//             //             yield selector(v);
//             //     }
//             // };

//             // grouping version
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (v instanceof Grouping)
//                         yield selector(...v);
//                     else 
//                         yield selector(v);
//                 }
//             };

//             // original version
//             // return function*() {
//             //     for (var v of _expand(iter)) {
//             //         yield selector(
//             //             ...( // spread
//             //                 iterables.flatten(v) // keep procedural as much as possible
//             //             )
//             //         );
//             //     }
//             // };
//         };

//         iterables.skip = function(iter, count) {
//             return function*() {
//                 var a,
//                     i = 0,
//                     expandedIter = _expand(iter);
//                 while (!(a = expandedIter.next()).done && i < count)
//                     i++;
//                 if (!a.done) {
//                     yield a.value; // yield the value at the starting point
//                     while(!(a = expandedIter.next()).done)
//                         yield a.value; // yield remaining values
//                 }
//             }
//         };

//         iterables.sum = function(iter, selector) {
//             var sum = 0;
//             if (z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     var num = selector(v);
//                     if (z.check.isNumber(num))
//                         sum += num;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.isNumber(v))
//                         sum += v;
//                 }
//             }
//             return sum;
//         };

//         iterables.take = function(iter, count) {
//             return function*() {
//                 var i = 0;
//                 for (var v of _expand(iter)) {
//                     if (count <= i++)
//                         break;
//                     yield v;
//                 }
//             };
//         };

//         iterables.takeWhile = function(iter, predicate) {
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (!predicate(v))
//                         break;
//                     yield v;
//                 }
//             };
//         };

//         iterables.toArray = function(iter) {
//             return ([..._expand(iter)]);
//         };

//         iterables.where = function(iter, predicate) {
//             "use strict";
//             // note - this gets crushed by generator comprehensions for performance
//             // this gets crushed by plain comprehensions for performance
//             // only real gain here is chainability with the other methods,
//             // as well as the ability to execute a predicate which contains
//             // additional logic (which may be an anti-pattern anyways).
            
//             // grouping version
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (v instanceof Grouping) {
//                         if (predicate(...v))
//                             yield v;
//                     }
//                     else {
//                         if (predicate(v))
//                             yield v;
//                     }
//                 }
//             };

//             // // old version
//             // return function*() {
//             //     for (var v of _expand(iter)) {
//             //         if (v[Symbol.iterator]) { // hacky? safe? its certainly faster.. worth losing safety for speed?
//             //             if (predicate(...v))
//             //                 yield v;
//             //         }
//             //         else {
//             //             if (predicate(v))
//             //                 yield v;
//             //         }
//             //     }
//             // };
//         };

//         iterables.where_safe = function(iter, predicate) {
//             "use strict";
//             // note - this gets crushed by generator comprehensions for performance
//             // this gets crushed by plain comprehensions for performance
//             // only real gain here is chainability with the other methods,
//             // as well as the ability to execute a predicate which contains
//             // additional logic (which may be an anti-pattern anyways).
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (predicate(v))
//                         yield v;
//                 }
//             };
//         };

//         iterables.zip = function(iter1, iter2, method) {
//             return function*() {
//                 var a, b;
//                 var expandedIter1 = _expand(iter1);
//                 var expandedIter2 = _expand(iter2);
//                 while (!(a = expandedIter1.next()).done && !(b = expandedIter2.next()).done)
//                     yield method(a.value, b.value);
//             };
//         };

//         z.iterables = iterables;

//         // wrapper class
//         // this should be used whenever generator extensions are not being used
//         // (HIGHLY SUGGESTED)
//         var Iterable = (function() {
//             function Iterable(iterable) {
//                 var self = this;
//                 if (z.check.isIterable(iterable))
//                     // note that this sort of falls apart
//                     // if the end user passes in an iterable of iterables
//                     // (so an array of arrays, array of sets, etc)

//                     // so here's the trade off.
//                     // do we want joins with function parameter selection,
//                     // or do we want users to use iterables of iterables as the source?
//                     self.data = iterable;
//                 else
//                     return null;
//                 return self;
//             }
//             // prototype items can also go here
//             return Iterable;
//         }());

//         // this should take the place of the array being yielded
//         // with multiple tables / data sets.
//         // this is a slight performance hit 
//         function Grouping() {}
//         Grouping.prototype = new Array; // lovely "inherit" shenanigans

        


//         // function* _prod(arrs, current, index) {
//         //     if (index == arrs.length-1) {
//         //         for (var v of arrs[index]) {
//         //             current[index] = v;
//         //             yield([...current]); // needs to be a copy, since
//         //         }
//         //     }
//         //     else {
//         //         for (var v of arrs[index]) {
//         //             current[index] = v;
//         //             yield* _prod(arrs, current, index+1);
//         //         }
//         //     }
//         // }
//         // function prod(...arrs) {
//         //     return function*() {
//         //         yield* _prod(arrs, [], 0);
//         //     }
//         // }

//         // place helper method on the root
//         z.from = function(iterable) {
//             return new Iterable(iterable);
//         };

//         Iterable.prototype[Symbol.iterator] = function() {
//             return _expand(this.data);
//         };

//         // this doesn't work yet,
//         // since Symbol.toStringTag isn't available.
//         // See: https://mail.mozilla.org/pipermail/es-discuss/2015-January/041149.html
//         // Also see at 19.1.3.6.14: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
//         Iterable.prototype['@@toStringTag'] = function() {
//             z.log('hit tostringtag for iterable');
//             return '[object Iterable]'; // for z.getType usage
//         };

//         Iterable.prototype.aggregate = function(func, seed) {
//             this.data = iterables.aggregate(this.data, func, seed);
//             return this;
//         };

//         Iterable.prototype.any = function(predicate) {
//             return iterables.any(this.data, predicate);
//         };

//         Iterable.prototype.at = function(index) {
//             return iterables.at(this.data, index);
//         };

//         Iterable.prototype.average = function(selector) {
//             return iterables.average(this.data, selector);
//         };

//         Iterable.prototype.concat = function(/* ... iter */) {
//             var args = Array.prototype.slice.call(arguments);
//             this.data = iterables.concat(this.data, ...args); // cant we just use ...arguments?
//             return this;
//         };

//         Iterable.prototype.crossJoin = function(iter2) {
//             this.data = iterables.crossJoin(this.data, iter2);
//             return this;
//         };

//         Iterable.prototype.contains = function(item, selector) {
//             return iterables.contains(this.data, item, selector);
//         };

//         Iterable.prototype.distinct = function(selector) {
//             this.data = iterables.distinct(this.data, selector);
//             return this;
//         };

//         Iterable.prototype.first = function(selector) {
//             return iterables.first(this.data, selector);
//         };

//         Iterable.prototype.flatten = function() {
//             this.data = iterables.flatten(this.data);
//             return this;
//         };

//         Iterable.prototype.innerJoin = function(iter2) {
//             this.data = iterables.innerJoin(this.data, iter2);
//             return this;
//         };

//         Iterable.prototype.isEmpty = function() {
//             return iterables.isEmpty(this.data);
//         };

//         Iterable.prototype.isFull = function() {
//             return iterables.isFull(this.data);
//         };

//         Iterable.prototype.join = function(iter2, predicate, selector) {
//             // if (this.data instanceof Grouping)
//             //     this.data.add(iter2);
//             // else
//             //     this.data = new Grouping(this.data, iter2);
//             this.data = iterables.join(this.data, iter2);
//             return this;
//             // this.data = iterables.join(this.data, iter2, predicate, selector);
//             // return this;
//         };

//         Iterable.prototype.last = function(predicate) {
//             return iterables.last(this.data, predicate);
//         };

//         Iterable.prototype.leftJoin = function(iter2) {
//             this.data = iterables.leftJoin(this.data, iter2);
//             return this;
//         };

//         Iterable.prototype.max = function(selector) {
//             return iterables.max(this.data, selector);
//         };

//         Iterable.prototype.min = function(selector) {
//             return iterables.min(this.data, selector);
//         };

//         Iterable.prototype.on = function(predicate) { 
//             // extension to help with innerJoin
//             // note that innerJoin MUST be called first. error trapping?
//             this.data = this.data.on(predicate);
//             return this;
//         };
        
//         Iterable.prototype.orderBy = function(selector, comparer) {
//             this.data = iterables.orderBy(this.data, selector, comparer);
//             return this;
//         };

//         Iterable.prototype.thenBy = function(selector, comparer) { 
//             // extension to help with orderBy
//             // note that orderBy MUST be called first. error trapping?
//             this.data = this.data.thenBy(selector, comparer);
//             return this;
//         };

//         Iterable.prototype.reverse = function() {
//             this.data = iterables.reverse(this.data);
//             return this;
//         };

//         Iterable.prototype.select = function(selector) {
//             this.data = iterables.select(this.data, selector);
//             return this;
//         };

//         Iterable.prototype.skip = function(count) {
//             this.data = iterables.skip(this.data, count);
//             return this;
//         };

//         Iterable.prototype.sum = function(selector) {
//             this.data = iterables.sum(this.data, selector);
//             return this;
//         };

//         Iterable.prototype.take = function(count) {
//             this.data = iterables.take(this.data, count);
//             return this;
//         };

//         Iterable.prototype.toArray = function() {
//             if (z.check.isArray(this.data))
//                 return this.data;
//             return iterables.toArray(this.data);
//         };

//         Iterable.prototype.where = function(predicate) {
//             this.data = iterables.where(this.data, predicate);
//             return this;
//         };

//         Iterable.prototype.where_safe = function(predicate) {
//             this.data = iterables.where_safe(this.data, predicate);
//             return this;
//         };

//         Iterable.prototype.where2 = function(predicate) {
//             this.data = iterables.where2(this.data, predicate);
//             return this;
//         };

//         iterables.where2 = function*(iter, predicate) {
//             // this is without a doubt the fastest
//             // but we lose the ability to "join" other data sets.
//             for (var v of _expand(iter)) {
//                 if (predicate(v))
//                     yield v;
//             }
//         };

//         Iterable.prototype.where3 = function(predicate) {
//             this.data = iterables.where3(this.data, predicate);
//             return this;
//         };

//         iterables.where3 = function*(iter, predicate) {
//             for (var v of _expand(iter)) {
//                 if (predicate(...iterables.flatten(v)))
//                     yield v;
//             }
//         };

//         Iterable.prototype.where4 = function(predicate) {
//             // this is the original, no flatten method.
//             // is it worth keeping flatten for internal joins,
//             // or should we just dump the idea of joins altogether?
//             // we really need a more performant way to pull joins off,
//             // if we are going to continue on with them.
//             this.data = iterables.where4(this.data, predicate);
//             return this;
//         };

//         iterables.where4 = function(iter, predicate) {
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (predicate(v))
//                         yield v;
//                 }
//             };
//         };

//         Iterable.prototype.arraywhere = function(predicate) {
//             // for performance checking reasons
//             this.data = z.arrays.where(this.data, predicate);
//             return this;
//         };

//         Iterable.prototype.zip = function(iter2, method) {
//             this.data = iterables.where(this.data, iter2, method);
//             return this;
//         };

//         Iterable.prototype.getType = function() {
//             return '[object Iterable]'; // hacky fix until Symbol.toStringTag is available.
//         };

//         z.classes.Iterable = Iterable; // put on classes in case users want to use new Iterable() instead of z.from
//     }

//     /**
//         Locate root, and determine how to use the factory method.
//     */
//     var root = (
//         typeof window !== 'undefined' ?
//             window
//             :  typeof global !== 'undefined' ?
//                 global 
//                 : this
//     );
//     if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
//         // define.amd exists
//         define(function() { return factory; });
//         root.z = z; // expose to root in case require() is not being used to load zana
//     }
//     else if (typeof module !== 'undefined') {
//         if (typeof module.exports !== 'undefined') {
//             module.exports = factory;
//         }
//     }
//     else if (typeof root.z !== 'undefined') {
//         // pass root.z to the factory
//         factory(root.z);
//     }
// }());
