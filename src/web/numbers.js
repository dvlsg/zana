/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

(function(z, undefined) {

    z.numbers = {};

    /**
        Calculates and returns the divisors for the provided integer.
        
        @param {integer} source The original integer.
        @returns An array containing the divisors for the integer.
    */
    z.numbers.divisors = function(/* source */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
        z.assert.isNumber(source);
        var small = [];
        var large = [];
        var end = Math.floor(Math.sqrt(source)); // no need to go over the square root
        for (var i = 1; i <= end; i++) {
            if (source % i == 0) {
                small.push(i);
                if (i * i !== source) {
                    large.push(source / i);
                }
            }
        }
        return small.concat(large.reverse()); // note: push and reverse is anywhere from 2x-54x faster than using unshift
    }

    /**
        Rounds the provided number to the nearest provided step.
        
        @param {number} source The original number.
        @param {number} roundBy The step to round by.
        @returns {number}
    */
    z.numbers.round = function(/* source, roundBy, direction */) {
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
    }

    /**
        Rounds the provided number down to the nearest provided step.
        
        @param {number} source The original number.
        @param {number} roundBy The step to round by.
        @returns {number} 
    */
    z.numbers.roundDown = function(/* source, roundBy */) {
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
    z.numbers.roundUp = function(/* source, roundBy */) {
        var argsIterator = 0;
        var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
        var roundBy = arguments[argsIterator++] || 1;
        z.assert.isNumber(source);
        return Math.ceil(source / roundBy) * roundBy;
    };

    /**
        Initializes all pre-defined methods
        as non-enumerable and non-writable properties
        located on the Number.prototype.
        
        @returns {void}
    */
    z.setup.initNumbers = function(usePrototype) {
        if (!!usePrototype) {
            z.defineProperty(Number.prototype, "divisors", { enumerable: false, writable: false, value: z.numbers.divisors });
            z.defineProperty(Number.prototype, "round", { enumerable: false, writable: false, value: z.numbers.round });
            z.defineProperty(Number.prototype, "roundDown", { enumerable: false, writable: false, value: z.numbers.roundDown });
            z.defineProperty(Number.prototype, "roundUp", { enumerable: false, writable: false, value: z.numbers.roundUp });
        }
    };

}(zUtil.prototype));