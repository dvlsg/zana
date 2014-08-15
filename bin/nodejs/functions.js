/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        var functions = z.functions = z.functions || {}; // note that z.functions is already defined with defaults in base.js

        /**
            Curries a function, allowing it to accept
            partial argument lists at differing times.

            @source {function} The function to curry.
            @returns The original curried function.
        */
        functions.curry = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.function ? this : arguments[argsIterator++];
            z.assert.isFunction(source);
            var sourceArgs = Array.prototype.slice.call(arguments);
            var sourceArgsLength = source.length;

            function curried(args) {
                if (args.length >= sourceArgsLength) {
                    return source.apply(null, args);
                }
                return function() {
                    return curried(args.concat(Array.prototype.slice.call(arguments)));
                }
            }
            return curried(sourceArgs);
        };
        
        /**
            Creates a deep copy of an original function.
            To be used for the function.prototype extension.
            
            @this {function}
            @returns A deep copy of the original function.
        */
        var _deepCopy = function() {
            return z.deepCopy(this);
        };

        /**
            Defines a property on this function.
            To be used for the function.prototype extension.
            
            @this {function}
            @param {string} name The name of the property.
            @param {any} prop The property to add.
            @returns {void}
         */
        var _defineProperty = function(name, propertyDefinition) {
            return z.defineProperty(this, name, propertyDefinition);
        };

        /**
            Determines the equality of two functions.
            To be used for the function.prototype extension.
            
            @this {function}
            @param {function} func2 The second function to compare.
            @returns True if both functions contain equal items, false if not.
         */
        var _equals = function(func2) {
            return z.equals(this, func2);
        };

        /**
            Extends the properties on the provided function arguments into the first function provided.
            To be used for the function.prototype extension.

            @this {function}
            @param {...function} var_args The tail functions to smash.
            @returns {any} A deep copy of the extended functions.
            @throws {error} An error is thrown if any of the provided arguments are not extendable.
        */
        var _extend = function(/* ...arguments */) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return z.functions.extend.apply(null, args);
        };

        /**
            Extends the properties on the provided function arguments into the first function provided.
            
            @param {...function} var_args The tail functions to use for extension.
            @returns {any} A deep copy of the extended functions.
            @throws {error} An error is thrown if any of the provided arguments are not extendable.
        */
        functions.extend = function(/* ...arguments */) {
            return z.extend.apply(null, arguments);
        };

        /**
            Returns the argument names for the function as an array.

            @param {function} source The function for which to collect arguments.
            @returns {array} An array containing any named arguments.
        */
        functions.getArgumentNames = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.function ? this : arguments[argsIterator++];
            z.assert.isFunction(source);
            var s = source.toString();
            var args = s.substring(s.indexOf("(")+1, s.indexOf(")")).trim().split(",");
            args.map(function(val, index, arr) {
                arr[index] = val.trim().replace(/(\n)?\/\*\*\//g, ""); // new Function() will append /**/ to argument lists, sometimes with a new line
            });
            return args;
        };

        /**
            Returns the body of the provided function as a string.

            @param {function} source The function from which to collect the body.
            @returns {string} A string representation of the function body.
        */
        functions.getBody = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.function ? this : arguments[argsIterator++];
            z.assert.isFunction(source);
            var s = source.toString();
            return s.toString().substring(s.indexOf("{")+1, s.indexOf("}")).trim();
        };

        /**
            Smashes the properties on the provided function arguments into a single function.
            To be used for the function.prototype extension.

            @this {function}
            @param {...function|object} var_args The tail functions to smash.
            @returns {any} A deep copy of the smashed functions.
            @throws {error} An error is thrown if any of the provided arguments are not functions.
        */
        var _smash = function(/* ...arguments */) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return z.functions.smash.apply(null, args);
        };

        /**
            Smashes the properties on the provided function arguments into a single function.
            
            @param {...function|object} var_args The tail functions to smash.
            @returns {any} A deep copy of the smashed functions.
            @throws {error} An error is thrown if any of the provided arguments are not functions.
        */
        functions.smash = function(/* ...arguments */) {
            return z.smash.apply(null, arguments);
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the function.prototype.
            
            @returns {void}
        */
        z.setup.initFunctions = function(usePrototype) {
            if (!!usePrototype) {
                z.defineProperty(Function.prototype, "curry", { enumerable: false, writable: false, value: functions.curry });
                z.defineProperty(Function.prototype, "deepCopy", { enumerable: false, writable: false, value: _deepCopy });
                z.defineProperty(Function.prototype, "defineProperty", { enumerable: false, writable: false, value: _defineProperty });
                z.defineProperty(Function.prototype, "equals", { enumerable: false, writable: false, value: _equals });
                z.defineProperty(Function.prototype, "extend", { enumerable: false, writable: false, value: _extend });
                z.defineProperty(Function.prototype, "getArgumentNames", { enumerable: false, writable: false, value: functions.getArgumentNames });
                z.defineProperty(Function.prototype, "getBody", { enumerable: false, writable: false, value: functions.getBody });
                z.defineProperty(Function.prototype, "smash", { enumerable: false, writable: false, value: _smash });
            }
        };
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());