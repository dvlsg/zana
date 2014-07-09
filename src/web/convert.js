/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(z, undefined) {

    z.classes = z.classes || {};

    /**
        Executes an conversion for a given source and type.
        
        @param {any} source The item to convert.
        @param {string} toType The type to which to convert.
        @returns {any} The converted source.
        @throws {error} An error is thrown if toType is not a string.
    */
    var convert = function(source, toType) {
        z.assert.isString(toType);
        switch (toType) {
            case z.types['boolean']: return toBoolean(source);
        }
    };

    /**
        Executes an conversion to boolean for a given source.
        
        @param {any} source The item to convert.
        @returns {boolean} The converted source.
        @throws {error} An error is thrown if source does not exist, or toType is not a string.
    */
    var toBoolean = function(source) {
        if (source && z.check.isFunction(source.toBoolean)) {
            return source.toBoolean(); // allow override to be supplied directly on the source object
        }
        switch (z.getType(source)) {
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
            default:
                return !!source;
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
                return newConverter;
            })(convert);
        }

        return Converter;
        
    })();

    z.classes.Converter = Converter;
    z.convert = new z.classes.Converter();
}(zUtil.prototype));