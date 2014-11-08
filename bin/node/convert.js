/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    "use strict";
    function factory(z) {

        z.classes = z.classes || {};

        /**
            Executes a conversion for a given source and type.
            
            @param {any} source The item to convert.
            @param {string} toType The type to which to convert.
            @returns {any} The converted source.
            @throws {error} An error is thrown if toType is not a string.
        */
        var convert = function(source, toType) {
            z.assert.isString(toType);
            switch (toType) {
                case z.types.boolean: return toBoolean(source);
                case z.types.date: return toDate(source);
                case z.types.number: return toNumber(source);
            }
        };

        /**
            Executes a conversion to boolean for a given source.
            
            @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        var toBoolean = function(source) {
            if (z.check.exists(source) && z.check.isFunction(source.toBoolean)) {
                return source.toBoolean(); // allow override to be supplied directly on the source object
            }
            switch (z.getType(source)) {
                case z.types.boolean:
                    return source;
                case z.types.string:
                    switch (source.toLowerCase().trim()) {
                        case "false":
                        case "0":
                        case "":
                        case null:
                        case undefined:
                            return false;
                        default:
                            return true;
                    }
                    break;
                default:
                    return !!source;
            }
        };

        /**
            Executes a conversion to a date for a given source.
            
            @param {any} source The item to convert.
            @returns {date} The converted source.
        */
        var toDate = function(source) {
            if (z.check.exists(source) && z.check.isFunction(source.toDate)) {
                return source.toDate();
            }
            switch (z.getType(source)) {
                case z.types.date:
                    return source;
                case z.types.string:
                    return new Date(Date.parse(source));
                default:
                    return new Date(Date.parse(source.toString()));
            }
        };

        /**
            Executes a conversion to a number for a given source.
            
            @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        var toNumber = function(source) {
            if (z.check.exists(source) && z.check.isFunction(source.toNumber)) {
                return source.toNumber(); // allow override to be supplied directly on the source object
            }
            switch (z.getType(source)) {
                case z.types.number:
                    return source;
                default:
                    return +source;
            }
        };

        /**
            A wrapper class used to hold and execute different assertion methods.

            @class Contains a provided set of assertions.
         */
        var Converter = (function() {

            /**
                Creates a new Asserter class.

                @constructor
                @param {object} logger The interface containing the expected log methods.
                @param {bool} [enableDebugLogging] An override for enabling debug logging on Log class creation.
            */
            function Converter() {

                /**
                    Extends a function into an Asserter interface with
                    the pre-determined, privately stored properties,
                    returning it back to the original Asserter() call.

                    @returns {function} The extended function.
                */
                return (function(newConverter) {
                    /**
                        The base Asserter function to be returned.
                        Note that the base function can be called
                        as a pass-through method for _assert without
                        needing to directly call LogInterface.log()

                        @param {any} [x] The item to extend and return to the Asserter class.
                        @returns {any} The extended item.
                    */
                    z.defineProperty(newConverter, "toBoolean", { get: function() { return toBoolean; }, writeable: false });
                    z.defineProperty(newConverter, "toDate", { get: function() { return toDate; }, writeable: false });
                    z.defineProperty(newConverter, "toNumber", { get: function() { return toNumber; }, writeable: false });
                    return newConverter;
                })(convert);
            }

            return Converter;
            
        })();

        z.classes.Converter = Converter;
        z.convert = new z.classes.Converter();
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