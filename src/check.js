/*
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};

    /**
     * Container for all utility checking methods.
     * 
     * @class Contains all utility checking methods.
     */
    var check = function() {};

    /**
     * Executes a compareRevision WebAPI call.
     * 
     * @param {string} selector An object containing the data for the request.
     * @returns {object} The AngularJS $http object from sendRequest.
     */
    check.argsNotNull = function() {
        z.assert(function() {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == null) {
                    return false;
                }
            }
            return true;
        });
        return true;
    }

    /**
     * Asserts that the provided value is not equal to null or undefined.
     * 
     * @param {any} value The value to check for null or undefined values.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the value is equal to null or undefined.
     */
    check.exists = function(value) {
        z.assert(function() {
            return value != null;
        });
        return true;
    }

    /**
     * Asserts that the provided value is an array type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isArray = function(value) {
        z.assert(function() {
            return z.getType(value) === z.types.array;
        });
        return true;
    }

    /**
     * Asserts that the provided value is a boolean type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isBoolean = function(value) {
        z.assert(function() {
            return z.getType(value) === z.types.boolean;
        });
        return true;
    }

    /**
     * Asserts that the provided value is a function type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isFunction = function(value) {
        z.assert(function() {
            return z.getType(value) === z.types.function;
        });
        return true;
    }

    /**
     * Asserts that the provided value is a number type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isNumber = function(value) {
        z.assert(function() { 
            return !isNaN(value); 
        });
        return true;
    }

    /**
     * Asserts that the provided value is an object type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isObject = function(value) {
        z.assert(function() {
            return z.getType(value) === z.types.object;
        });
        return true;
    }

    /**
     * Asserts that the provided value is a reference type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isReference = function(value) {
        z.assert(function() { 
            var objType = z.getType(value);
            return (
                    valType === z.types.object
                ||  valType === z.types.array
                ||  valType === z.types.date
                ||  valType === z.types.regexp
                ||  valType === z.types.function
            );
        });
        return true;
    }

    /**
     * Asserts that the provided value is a string type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isString = function(value) {
        z.assert(function() { 
            return z.getType(value) === z.types.string;
        });
        return true;
    }

    /**
     * Asserts that the provided value is a provided type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @param {string} type The name of the type for which to check.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isType = function(value, type) {
        z.assert(function() {
            return z.getType(value) === type;
        });
        return true;
    }

    /**
     * Asserts that the provided value is a value (non-reference) type.
     * 
     * @param {any} value The value on which to check the assertion.
     * @returns {boolean} True, if the assertion passes.
     * @throws {error} An error is thrown if the assertion fails.
     */
    check.isValue = function(value) {
        z.assert(function() { 
            var valType = z.getType(value);
            return (
                    valType === z.types.string
                ||  valType === z.types.boolean
                ||  valType === z.types.number
                ||  valType === z.types.null
                ||  valType === z.types.undefined
            );
        });
        return true;
    }

    z.check = check;
    w.util = z;
}(window || this));