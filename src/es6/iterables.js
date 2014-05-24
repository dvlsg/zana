/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

(function(z, undefined) {

    z.iterables = {};

    z.iterables.aggregate = function(iter, func, seed) {
        z.assert.isIterable(iter);
        z.assert.isFunction(func);
        var result;
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

    var _reverse = function*(iter, a) {
        if (!a.done) {
            yield* _reverse(iter, iter.next());
            yield a.value;
        }
    };
    z.iterables.reverse = function*(iter) {
        z.assert.isIterable(iter);
        yield* _reverse(iter, iter.next());
    };

    z.iterables.toArray = function(iter) {
        z.assert.isIterable(iter);
        var result = [];
        for (var v of iter) {
            result.push(v);
        }
        return result;
    };

    z.iterables.where = function*(iter, predicate) {
        z.assert.isIterable(iter);
        z.assert.isFunction(predicate);
        for (var v of iter) {
            if (predicate(v)) {
                yield v;
            }
        }
    };

    z.iterables.zip = function*(iter1, iter2, method) {
        z.assert.isIterable(iter1);
        z.assert.isIterable(iter2);
        var a, b;
        while (!(a = iter1.next()).done && !(b = iter2.next()).done) {
            yield method(a.value, b.value);
        }
    };

    /**
        Initializes all pre-defined methods
        as non-enumerable and non-writable properties
        located on the Array.prototype.
        
        @returns {void}
    */
    // z.setup.initGenerators = function(usePrototype) {
        // if (!!usePrototype) {
            // z.defineProperty(GeneratorFunctionPrototype, "toArray", { enumerable: false, writable: false, value: z.generators.toArray });
            // z.defineProperty(GeneratorFunctionPrototype, "where", { enumerable: false, writable: false, value: z.generators.where });
            // z.defineProperty(GeneratorObjectPrototype, "where", { enumerable: false, writable: false, value: z.generators.where });
        // }
    // };
}(zUtil.prototype));