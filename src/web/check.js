/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(z, undefined) {

    /**
        Container for all utility checking methods.
        
        @class Contains all utility checking methods.
    */
    var check = function() {};

    /**
        Checks that all of the arguments provided for a method
        are neither null nor undefined.
        
        @param {string} var_args The arguments provided to a method.
        @returns {boolean} True if the check passes, false if not.
    */
    check.argsNotNull = function() {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] == null) {
                return false;
            }
        }
        return true;
    };

    /**
        Checks that the provided value is not equal to null or undefined.
        
        @param {any} value The value to check for null or undefined values.
        @returns {boolean} True if the check passes, false if not.
    */
    check.exists = function(value) {
        return value != null;
    };

    /**
        Checks that the provided value is an array type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isArray = function(value) {
        return z.getType(value) === z.types.array;
    };

    /**
        Checks that the provided value is a boolean type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isBoolean = function(value) {
        return z.getType(value) === z.types.boolean;
    };

    /**
        Checks that the provided value is a function type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isFunction = function(value) {
        return z.getType(value) === z.types.function;
    };

    /**
        Checks that the provided value is a generator function type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isGeneratorFunction = function(value) {
        return z.getType(value) === z.types.function && value.isGenerator();
    };

    /**
        Checks that the provided value is an iterable type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isIterable = function(value) {
        if (value == null) return false;
        var iterator = value[z.symbols.iterator] || value.prototype[z.symbols.iterator]; // will this always be on prototype?
        return z.getType(iterator) === z.types.function;
    };

    /**
        Checks that the provided value is a non-empty array.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isNonEmptyArray = function(value) {
        return (value != null && z.getType(value) === z.types.array && value.length > 0);
    };

    /**
        Checks that the provided value is a number type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isNumber = function(value) {
        return !isNaN(value); 
    };

    /**
        Checks that the provided value is an object type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isObject = function(value) {
        return z.getType(value) === z.types.object;
    };

    /**
        Checks that the provided value is a reference type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isReference = function(value) {
        switch (z.getType(value)) {
            case z.types.array:
            case z.types.date:
            case z.types.function:
            case z.types.generator:
            case z.types.generatorFunction:
            case z.types.object:
            case z.types.regexp:
                return true;
            default:
                return false;
        }
    };

    /**
        Checks that the provided arguments are all 
        the same type of either arrays, functions, or objects.
        
        @param {...array|object|function} var_args The items to check for smashability.
        @returns {boolean} True, if the check passes, false if not.
    */
    check.isSmashable = function(/* ... arguments */) {
        var args = Array.prototype.slice.call(arguments);

        if (args.length < 1)
            return false;
 
        var baseType = z.getType(args[0]);
        if (!(baseType === z.types.array || baseType === z.types.object || baseType === z.types.function))
            return false;

        if (baseType === z.types.function)
            baseType = z.types.object; // allow functions to be smashed onto objects, and vice versa

        for (var i = 1; i < args.length; i++) {
            var targetType = z.getType(args[i]);
            if (targetType === z.types.function)
                targetType = z.types.object; // allow functions to be smashed onto objects, and vice versa

            if (targetType !== baseType)
                return false;
        }
        return true;
    };

    /**
        Checks that the provided value is a string type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isString = function(value) {
        return z.getType(value) === z.types.string;
    };

    /**
        Checks that the provided value is a provided type.
        
        @param {any} value The value on which to check the check.
        @param {string} type The name of the type for which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isType = function(value, type) {
        return z.getType(value) === type;
    };

    /**
        Checks that the provided value is a value (non-reference) type.
        
        @param {any} value The value on which to check the check.
        @returns {boolean} True if the check passes, false if not.
    */
    check.isValue = function(value) {
        switch (z.getType(value)) {
            case z.types.boolean:
            case z.types.null: // value or reference?
            case z.types.number:
            case z.types.string:
            case z.types.undefined: // value or reference?
                return true;
            default:
                return false;
        }
    };

    z.check = check;
    
}(zUtil.prototype));