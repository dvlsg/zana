/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(w, undefined) {
    var z = w.util || {};
    z.classes = z.classes || {};

    /**
        A wrapper class used to hold and execute different assertion methods.

        @class Contains a provided set of assertions.
     */
    var Asserter = (function() {

        /**
            Creates a new Asserter class.

            @constructor
            @param {object} logger The interface containing the expected log methods.
            @param {bool} [enableDebugLogging] An override for enabling debug logging on Log class creation.
        */
        function Asserter() {

            /**
                Executes an assertion for a given condition.
                
                @param {boolean|function} condition The item used to determine whether or not an assertion passed.
                @param {string} [message] The overridden message to use when throwing an error. If none is provided, then the condition is used as a message.
                @returns {void}
                @throws {error} An error is thrown if the assertion fails.
            */
            var _assert = function(condition, message) {
                var parent = arguments.callee.caller;
                if (z.getType(condition) === z.types.function) {
                    if (!condition()) {
                        if(message) throw new Error(message);
                        else {
                            var functionString = condition.toString();
                            var functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
                            throw new Error("Assertion failed: " + functionBody);
                        }
                    }
                }
                else if (z.getType(condition) === z.types.string) {
                    condition = z.lambda(condition).bind(parent);
                    if (!condition()) {
                        if(message) throw new Error(message);
                        else {
                            var functionString = condition.toString();
                            var functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
                            throw new Error("Assertion failed: " + functionBody);
                        }
                    }
                }
                else {
                    if (!condition) {
                        if(message) throw new Error(message);
                        else        throw new Error("Assertion failed: " + String(condition));
                    } // end if (!condition)
                }
            }

            /**
                Asserts that all of the arguments provided for a method existing.
                
                @param {string} var_args The arguments provided to a method.
                @returns {boolean} True, if the assertion passes.
            */
            var _argsNotNull = function() {
                _assert(function() { return z.check.argsNotNull.apply(this, arguments); });
            };

            /**
                Asserts that the provided value is not equal to null or undefined.
                
                @param {any} value The value to check for null or undefined values.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the value is equal to null or undefined.
            */
            var _exists = function(value) {
                _assert(function() { return z.check.exists(value); });
            };

            /**
                Asserts that the provided value is an array type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isArray = function(value) {
                _assert(function() { return z.check.isArray(value); });
            };

            /**
                Asserts that the provided value is a boolean type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isBoolean = function(value) {
                _assert(function() { return z.check.isBoolean(value); });
            };

            /**
                Asserts that the provided value is a function type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isFunction = function(value) {
                _assert(function() { return z.check.isFunction(value); });
            };

            /**
                Asserts that the provided value is a non-empty array.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isNonEmptyArray = function(value) {
                _assert(function() { return z.check.isNonEmptyArray(value); });
            };

            /**
                Asserts that the provided value is a number type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isNumber = function(value) {
                _assert(function() { return z.check.isNumber(value); });
            };

            /**
                Asserts that the provided value is an object type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isObject = function(value) {
                _assert(function() { return z.check.isObject(value); });
            };

            /**
                Asserts that the provided value is a reference type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isReference = function(value) {
                _assert(function() { return z.check.isReference(value); });
            };

            /**
                Asserts that the provided value is a string type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True if the value is a string, false if not.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isString = function(value) {
                _assert(function() { return z.check.isString(value); });
            };

            /**
                Asserts that the provided value is a provided type.
                
                @param {any} value The value on which to check the assertion.
                @param {string} type The name of the type for which to check.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isType = function(value, type) {
                _assert(function() { return z.check.isType(value, type); });
            };

            /**
                Asserts that the provided value is a value (non-reference) type.
                
                @param {any} value The value on which to check the assertion.
                @returns {boolean} True, if the assertion passes.
                @throws {error} An error is thrown if the assertion fails.
            */
            var _isValue = function(value) {
                _assert(function() { return z.check.isValue(value); });
            };
            

            /**
                Extends a function into an Asserter interface with
                the pre-determined, privately stored properties,
                returning it back to the original Asserter() call.

                @returns {function} The extended function.
            */
            return (function(newAsserter) {
                /**
                    The base Asserter function to be returned.
                    Note that the base function can be called
                    as a pass-through method for _assert without
                    needing to directly call LogInterface.log()

                    @param {any} [x] The item to extend and return to the Asserter class.
                    @returns {any} The extended item.
                */
                z.defineProperty(newAsserter, "argsNotNull", { get: function() { return _argsNotNull; }, writeable: false });
                z.defineProperty(newAsserter, "exists", { get: function() { return _exists; }, writeable: false });
                z.defineProperty(newAsserter, "isArray", { get: function() { return _isArray; }, writeable: false });
                z.defineProperty(newAsserter, "isBoolean", { get: function() { return _isBoolean; }, writeable: false });
                z.defineProperty(newAsserter, "isFunction", { get: function() { return _isFunction; }, writeable: false });
                z.defineProperty(newAsserter, "isNonEmptyArray", { get: function() { return _isNonEmptyArray; }, writeable: false });
                z.defineProperty(newAsserter, "isNumber", { get: function() { return _isNumber; }, writeable: false });
                z.defineProperty(newAsserter, "isObject", { get: function() { return _isObject; }, writeable: false });
                z.defineProperty(newAsserter, "isReference", { get: function() { return _isReference; }, writeable: false });
                z.defineProperty(newAsserter, "isString", { get: function() { return _isString; }, writeable: false });
                z.defineProperty(newAsserter, "isType", { get: function() { return _isType; }, writeable: false });
                z.defineProperty(newAsserter, "isValue", { get: function() { return _isValue; }, writeable: false });
                return newAsserter;
            })(_assert);
        }

        return Asserter;
        
    })();

    z.classes.Asserter = Asserter;
    z.assert = new z.classes.Asserter(); // add a default Log using the console as the logging interface
    w.util = z;
}(window || this));