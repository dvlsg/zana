/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

module.exports = function(util) {

    var z = util.prototype;
    z.generators = {};

    // yield keyword wont work until ecmascript 6
    // z.AsEnumerable = function(source) {
    //     if (z.checkArgs(source)) {
    //         for (var i = 0; i < source.length; i++) {
    //             yield source[i];
    //         }
    //     }
    // }

    function* Chainable(iterable) {
      if (iterable && typeof iterable[iteratorSymbol] === "function") {
        yield* iterable;
      }
    }

    // Generators don't set their "constructor" property like normal functions do.
    Object.defineProperty(Chainable.prototype, "constructor", {
      configurable: true,
      writable: true,
      value: Chainable
    });

    function helper(f) {
      if (f instanceof GeneratorFunction) {
        f.prototype = Chainable.prototype;
      }
      return f;
    }
     
    /**
     * Export a function and set it to use the shared prototype.
     */
    function exportFunction(f) {
      helper(f);
      return exports[f.name] = f;
    }
     
    /**
     * Export a function and also add a method version of it to the shared
     * prototype. This allows it to be used to chain from other generators produced
     * by the generator functions in this module.
     *
     * @see exportFunction
     */
    function exportMethod(f) {
      exportFunction(f);
      Chainable.prototype[f.name] = function(...args) {
        return f(this, ...args);
      };
    }


    const GeneratorFunction = function*(){}.constructor;
    const iteratorSymbol = (typeof Symbol === "function" && Symbol.iterator) || "@@iterator";
    const iter = function(iterable) {
        console.log(iterable);
        console.log(Symbol);
        console.log(Symbol.iterator);
        console.log(iterable[iteratorSymbol]);
        console.log(iteratorSymbol);

      if (iterable && typeof iterable[iteratorSymbol] === "function") {
        return iterable[iteratorSymbol]();
      }
      throw new TypeError("target is not iterable");
    };

    var gen = function*() {
        yield 1;
        yield 2;
        yield 3;
    };

    for (var p in gen) {
        console.log(p);
    }

    console.log(gen["@@iterator"]);
    // console.log(iter(gen));

    z.generators.toArray = function(/* source */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.generator ? this : arguments[argsIterator++];
        var result = [];
        for (let v of source) {
            result.push(v);
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
    z.generators.where = function*(/* source, predicate */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.generator ? this : arguments[argsIterator++];
        var predicate = arguments[argsIterator++];
        predicate = z.lambda(predicate);
        var result = [];
        for (let v of source) {
            if (predicate(v)) {
                yield v;
            }
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
            z.defineProperty(Generator.prototype, "toArray", { enumerable: false, writable: false, value: z.generators.toArray });
            z.defineProperty(Generator.prototype, "where", { enumerable: false, writable: false, value: z.generators.where });
        }
    };
};