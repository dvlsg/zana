/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    function factory(z) {

        z.generators = z.generators || {};

        z.generators.aggregate = function(/* source, func, seed*/) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var func = arguments[argsIterator++];
            var seed = arguments[argsIterator++];
            return z.iterables.aggregate(source, func, seed);
        };

        z.generators.any = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            return z.iterables.any(source, predicate);
        };

        z.generators.concat = function(/* ... gens */) {
            var args = Array.prototype.slice.call(arguments);
            if (z.check.isIterable(this)) {
                args.unshift(this);
            }
            return z.iterables.concat.apply(null, args);
        };

        z.generators.deepCopy = function(/* source */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            return z.deepCopy(source);
        };

        z.generators.distinct = function(/* source, selector */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            return z.iterables.distinct(source, selector);
        };

        z.generators.equals = function(/* gen1, gen2 */) {
            var argsIterator = 0;
            var gen1 = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var gen2 = arguments[argsIterator++];
            return z.equals(gen1, gen2);
        };

        z.generators.first = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            return z.iterables.first(source, predicate);
        };

        z.generators.innerJoin = function(/* gen1, gen2 */) {
            var argsIterator = 0;
            var gen1 = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var gen2 = arguments[argsIterator++];
            return z.iterables.innerJoin(gen1, gen2);
        };

        z.generators.last = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            return z.iterables.last(source, predicate);
        };

        z.generators.max = function(/* source, selector */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            return z.iterables.max(source, selector);
        };

        z.generators.min = function(/* source, selector */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            return z.iterables.min(source, selector);
        };

        z.generators.orderBy = function(/* source, selector, comparer */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var comparer = arguments[argsIterator++];
            return z.iterables.orderBy(source, selector, comparer);
        };

        z.generators.reverse = function(/* source */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            return z.iterables.reverse(source);
        };

        z.generators.select = function(/* source, selector */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            return z.iterables.select(source, selector);
        };

        z.generators.skip = function(/* source, count */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var count = arguments[argsIterator++];
            return z.iterables.skip(source, count);
        };

        z.generators.sum = function(/* source, selector */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            return z.iterables.sum(source, selector);
        };

        z.generators.take = function(/* source, count */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var count = arguments[argsIterator++];
            return z.iterables.take(source, count);
        };

        z.generators.toArray = function(/* source */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            return z.iterables.toArray(source);
        };

        /**
            Builds a generator function from the 
            original generator function which contains items
            that meet the conditions given by the predicate.
            
            @param {GeneratorFunction} source The original generator function.
            @param {Function} predicate A predicate used to determine whether or not to take an object on the array.
            @returns {GeneratorFunction} A generator function which will only yield items which match the predicate.
        */
        z.generators.where = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            return z.iterables.where(source, predicate);
        };

        z.generators.zip = function(/* gen1, gen2, method */) {
            var argsIterator = 0;
            var gen1 = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
            var gen2 = arguments[argsIterator++];
            var method = arguments[argsIterator++];
            return z.iterables.zip(gen1, gen2, method);
        };

        // helper functions for building generators
        z.generators.numbers = function(start, step) {
            z.assert.isNumber(start);
            z.assert.isNumber(step);
            return function*() {
                var current = start;
                while (true) {
                    yield current;
                    current += step;
                }
            };
        };
        z.generators.numbers.random = function(min, max) {
            z.assert.isNumber(min);
            z.assert.isNumber(max);
            return function*() {
                while (true) {
                    yield Math.floor(Math.random() * (max - min + 1)) + min;
                }
            };
        };
        z.generators.numbers.whole = function*() {
            var i = 0;
            while (true) {
                yield i++;
            }
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the Array.prototype.
            
            @returns {void}
        */
        z.setup.initGenerators = function(usePrototype) {
            if (!!usePrototype) {

                function* g() { yield 1; } // to get a hold of the prototype
                var GeneratorFunctionPrototype = Object.getPrototypeOf(g);
                var GeneratorFunction = GeneratorFunctionPrototype.constructor;
                var GeneratorObjectPrototype = GeneratorFunctionPrototype.prototype;

                var g2 = g();
                var GeneratorFunctionPrototype2 = Object.getPrototypeOf(g2);
                var GeneratorFunction2 = GeneratorFunctionPrototype2.constructor;
                var GeneratorObjectPrototype2 = GeneratorFunctionPrototype2.prototype;

                // super hackish.. should be revisited at some point
                // would be resolved / unnecessary if es6 allows iteration over the GeneratorFunction
                // by automatically generating a GeneratorObject on an iteration attempt
                Object.defineProperty(GeneratorFunctionPrototype, Symbol.iterator, {
                    get: function() {
                        // return this()[Symbol.iterator]; // this doesn't work, for some reason
                        return (function() { return this()[Symbol.iterator](); }); // this, on the other hand, does?
                    }
                });

                z.defineProperty(GeneratorFunctionPrototype, "aggregate", { value: z.generators.aggregate, enumerable: false, writable: false  });
                z.defineProperty(GeneratorFunctionPrototype, "any", { value: z.generators.any, enumerable: false, writable: false  });
                z.defineProperty(GeneratorFunctionPrototype, "concat", { value: z.generators.concat, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "deepCopy", { value: z.generators.deepCopy, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "distinct", { value: z.generators.distinct, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "equals", { value: z.generators.equals, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "first", { value: z.generators.first, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "innerJoin", { value: z.generators.innerJoin, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "last", { value: z.generators.last, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "max", { value: z.generators.max, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "min", { value: z.generators.min, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "orderBy", { value: z.generators.orderBy, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "reverse", { value: z.generators.reverse, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "take", { value: z.generators.take, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "toArray", { value: z.generators.toArray, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "select", { value: z.generators.select, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "skip", { value: z.generators.skip, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "sum", { value: z.generators.sum, enumerable: false, writable: false });
                z.defineProperty(GeneratorFunctionPrototype, "where", { value: z.generators.where, enumerable: false, writable: false});
                z.defineProperty(GeneratorFunctionPrototype, "zip", { value: z.generators.zip, enumerable: false, writable: false });
                

                // if we want to set something on an expanded generator's prototype, use GeneratorObjectPrototype
                // z.defineProperty(GeneratorObjectPrototype, "zip", { value: z.generators.zip, enumerable: false, writable: false });
            }
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