/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

(function(z, undefined) {

    z.generators = z.generators || {};

    var _makeIterable = function(possibleGenerator) {
        // note: this is not needed with the hackish Object.defineProperty of iterator symbol on GeneratorFunctionPrototype
        if (possibleGenerator.isGenerator && possibleGenerator.isGenerator()) {
            possibleGenerator = possibleGenerator();
        }
        // z.assert.isGeneratorFunction(possibleGenerator);
        return possibleGenerator;
    };


    z.generators.aggregate = function(/* source, func, seed*/) {
        var argsIterator = 0;
        var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
        var func = arguments[argsIterator++];
        var seed = arguments[argsIterator++];
        return z.iterables.aggregate(_makeIterable(source), func, seed);
    };

    z.generators.any = function(/* source, predicate */) {
        var argsIterator = 0;
        var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        return z.iterables.any(source, predicate);
    };

    z.generators.reverse = function(/* source */) {
        var argsIterator = 0;
        var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
        // console.log(z.iterables.reverse);
        return z.iterables.reverse(source);
    };

    z.generators.toArray = function(/* source */) {
        var argsIterator = 0;
        var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
        return z.iterables.toArray(_makeIterable(source));
    };

    /**
        Builds a iterable from the original iterable 
        which contains items that meet the conditions
        given by the predicate.
        
        @this {array}
        @param {function} predicate A predicate used to determine whether or not to take an object on the array.
        @returns {iterable} An iterable collection of items which match the predicate.
    */
    z.generators.where = function(/* source, predicate */) {
        var argsIterator = 0;
        var source = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        return z.iterables.where(source, predicate);

        //// working - dont lose
        // if (source.isGenerator()) {
        //     for (var v of source()) {
        //         if (predicate(v)) {
        //             yield v;
        //         }
        //     }
        // }
    };

    z.generators.zip = function*(/* gen1, gen2, method */) {
        var argsIterator = 0;
        var gen1 = (z.check.isIterable(this)) ? this : arguments[argsIterator++];
        var gen2 = arguments[argsIterator++];
        var method = arguments[argsIterator++];
        yield* z.iterables.zip(_makeIterable(gen1), _makeIterable(gen2), method);
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

            Object.defineProperty(GeneratorFunctionPrototype, z.symbols.iterator, {
                get: function() {
                    return (function() { return this()[z.symbols.iterator](); }); // WORKS DONT LOSE
                }
            });

            z.defineProperty(GeneratorFunctionPrototype, "aggregate", { value: z.generators.aggregate, enumerable: false, writable: false  });
            z.defineProperty(GeneratorFunctionPrototype, "any", { value: z.generators.any, enumerable: false, writable: false  });
            z.defineProperty(GeneratorFunctionPrototype, "reverse", { value: z.generators.reverse, enumerable: false, writable: false });
            z.defineProperty(GeneratorFunctionPrototype, "toArray", { value: z.generators.toArray, enumerable: false, writable: false });
            z.defineProperty(GeneratorFunctionPrototype, "where", { value: z.generators.where, enumerable: false, writable: false});
            z.defineProperty(GeneratorFunctionPrototype, "zip", { value: z.generators.zip, enumerable: false, writable: false });
            
            // z.defineProperty(GeneratorObjectPrototype, "aggregate", { value: z.generators.aggregate, enumerable: false, writable: false });
            // z.defineProperty(GeneratorObjectPrototype, "any", { value: z.generators.any, enumerable: false, writable: false });
            // z.defineProperty(GeneratorObjectPrototype, "reverse", { value: z.generators.reverse, enumerable: false, writable: false });
            // z.defineProperty(GeneratorObjectPrototype, "toArray", { value: z.generators.toArray, enumerable: false, writable: false });
            // z.defineProperty(GeneratorObjectPrototype, "where", { value: z.generators.where, enumerable: false, writable: false});
            // z.defineProperty(GeneratorObjectPrototype, "zip", { value: z.generators.zip, enumerable: false, writable: false });
        }
    };
}(zUtil.prototype));