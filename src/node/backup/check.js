/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
module.exports = function(z) {

    /**
        Container for all utility checking methods.
        
        @class Contains all utility checking methods.
    */
    var check = function() {};

    /**
        Asserts that all of the arguments provided for a method existing.
        
        @param {string} var_args The arguments provided to a method.
        @returns {boolean} True, if the assertion passes.
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
        Asserts that the provided value is not equal to null or undefined.
        
        @param {any} value The value to check for null or undefined values.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the value is equal to null or undefined.
    */
    check.exists = function(value) {
        return value != null;
    };

    /**
        Asserts that the provided value is an array type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isArray = function(value) {
        return z.getType(value) === z.types.array;
    };

    /**
        Asserts that the provided value is a boolean type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isBoolean = function(value) {
        return z.getType(value) === z.types.boolean;
    };

    /**
        Asserts that the provided value is a function type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isFunction = function(value) {
        return z.getType(value) === z.types.function;
    };

    /**
        Asserts that the provided value is a non-empty array.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isNonEmptyArray = function(value) {
        return (value != null && z.getType(value) === z.types.array && value.length > 0);
    };

    /**
        Asserts that the provided value is a number type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isNumber = function(value) {
        return !isNaN(value); 
    };

    /**
        Asserts that the provided value is an object type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isObject = function(value) {
        return z.getType(value) === z.types.object;
    };

    /**
        Asserts that the provided value is a reference type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isReference = function(value) {
        switch (z.getType(value)) {
            case z.types.object:
            case z.types.array:
            case z.types.date:
            case z.types.regexp:
            case z.types.function:
                return true;
            default:
                return false;
        }
        // var objType = z.getType(value);
        // return (
        //         valType === z.types.object
        //     ||  valType === z.types.array
        //     ||  valType === z.types.date
        //     ||  valType === z.types.regexp
        //     ||  valType === z.types.function
        // );
    };

    /**
        Asserts that the provided value is a string type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True if the value is a string, false if not.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isString = function(value) {
        return z.getType(value) === z.types.string;
    };

    /**
        Asserts that the provided value is a provided type.
        
        @param {any} value The value on which to check the assertion.
        @param {string} type The name of the type for which to check.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isType = function(value, type) {
        return z.getType(value) === type;
    };

    /**
        Asserts that the provided value is a value (non-reference) type.
        
        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    check.isValue = function(value) {
        switch (z.getType(value)) {
            case z.types.string:
            case z.types.boolean:
            case z.types.number:
            case z.types.null: // value or reference?
            case z.types.undefined: // value or reference?
                return true;
            default:
                return false;
        }
        // var valType = z.getType(value);
        // return (
        //         valType === z.types.string
        //     ||  valType === z.types.boolean
        //     ||  valType === z.types.number
        //     ||  valType === z.types.null
        //     ||  valType === z.types.undefined
        // );
    };

    z.check = check;
};