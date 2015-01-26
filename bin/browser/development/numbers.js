/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    "use strict";
    function factory(z) {

        var numbers = z.numbers = {};

        /**
            Calculates and returns the factors for the provided integer.
            
            @param {integer} source The original integer.
            @returns An array containing the divisors for the integer.
        */
        numbers.factors = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            z.assert.isNumber(source);
            var small = [];
            var large = [];
            for (var i = 1; i <= Math.floor(Math.sqrt(source)); i++) {
                if (source % i === 0) {
                    small.push(i);
                    if (source / i !== i) {
                        large.push(source / i);
                    }
                }
            }
            return small.concat(large.reverse()); // note: push and reverse is anywhere from 2x-54x faster than using unshift
        };

        /**
            Rounds the provided number to the nearest provided step.
            
            @param {number} source The original number.
            @param {number} roundBy The step to round by.
            @returns {number}
        */
        numbers.round = function(/* source, roundBy, direction */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            var roundBy = arguments[argsIterator++] || 1;
            var direction = arguments[argsIterator++];
            z.assert.isNumber(source);
            if (direction) {
                direction = direction.toString().toLowerCase();
                if (direction === 'down') {
                    return z.numbers.roundDown(source, roundBy);
                }
                else if (direction === 'up') {
                    return z.numbers.roundUp(source, roundBy);
                }
            }
            return Math.round(source / roundBy) * roundBy;
        };

        /**
            Rounds the provided number down to the nearest provided step.
            
            @param {number} source The original number.
            @param {number} roundBy The step to round by.
            @returns {number} 
        */
        numbers.roundDown = function(/* source, roundBy */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            var roundBy = arguments[argsIterator++] || 1;
            z.assert.isNumber(source);
            return Math.floor(source / roundBy) * roundBy;
        };

        /**
            Rounds the provided number up to the nearest provided step.
            
            @param {number} source The original number.
            @param {number} roundBy The step to round by.
            @returns {number} 
        */
        numbers.roundUp = function(/* source, roundBy */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            var roundBy = arguments[argsIterator++] || 1;
            z.assert.isNumber(source);
            return Math.ceil(source / roundBy) * roundBy;
        };

        /**
            Places all number extensions on the provided object or prototype.

            @param {obj} object The object to be extended with number methods.
        */
        numbers.extendTo = function(obj) {
            z.defineProperty(obj, "factors", { enumerable: false, writable: true, value: z.numbers.factors });
            z.defineProperty(obj, "round", { enumerable: false, writable: true, value: z.numbers.round });
            z.defineProperty(obj, "roundDown", { enumerable: false, writable: true, value: z.numbers.roundDown });
            z.defineProperty(obj, "roundUp", { enumerable: false, writable: true, value: z.numbers.roundUp });
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the Number.prototype.
            
            @returns {void}
        */
        z.setup.initNumbers = function(usePrototype) {
            if (!!usePrototype)
                numbers.extendTo(Number.prototype);
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