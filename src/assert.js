/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

// can we extend error to be AssertionError now?

export class AssertionError extends Error {
    constructor(message) { // necessary?
        super(message);
    }
}

export default class Assert {

    constructor({ check }) {
        this.check = check;

        // for (let method in check) {
        //     // well this doesn't work. wrapping all of check methods in assert seems fine. find a way.
        // }
    }

    is(condition, expected, message = null) {
        if (this.check.isFunction(condition)) {
            if (condition() !== expected) { // or double equals?
                if(message)
                    throw new AssertionError(message);
                else {
                    let functionString = condition.toString();
                    let functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
                    throw new AssertionError(`Assertion failed: ${functionBody}`);
                }
            }
        }
        else {
            if (condition !== expected) {
                if(message)
                    throw new AssertionError(message);
                else
                    throw new AssertionError(`Assertion failed: ${String(condition)}`);
            }
        }
    }

    true(condition, message = null) {
        return this.is(condition, true, message);
    }

    false(condition, message = null) {
        return this.is(condition, false, message);
    }

    /**
        Asserts that all of the arguments provided for a method existing.

        @param {string} var_args The arguments provided to a method.
        @returns {boolean} True, if the assertion passes.
    */
    argsNotNull = function(...args) {
        this.true(() => this.check.argsNotNull.apply(null, args));
    }

    /**
        Asserts that the provided value is not equal to null or undefined.

        @param {any} value The value to check for null or undefined values.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the value is equal to null or undefined.
    */
    exists(value) {
        this.true(() => this.check.exists(value));
    }

    /**
        Asserts that the provided value is an array type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isArray(value) {
        this.true(() => this.check.isArray(value));
    }

    /**
        Asserts that the provided value is a boolean type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isBoolean(value) {
        this.true(() => this.check.isBoolean(value));
    }

    /**
        Asserts that the provided value is a date type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isDate(value) {
        this.true(() => this.check.isDate(value));
    }

    /**
        Asserts that the provided value is a function type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isFunction(value) {
        this.true(() => this.check.isFunction(value));
    }

    isIterable(value) {
        this.true(() => this.check.isIterable(value));
    }

    /**
        Asserts that the provided value is a non-empty array.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isNonEmptyArray(value) {
        this.true(() => this.check.isNonEmptyArray(value));
    }

    /**
        Asserts that the provided value is a number type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isNumber(value) {
        this.true(() => this.check.isNumber(value));
    }

    /**
        Asserts that the provided value is an object type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isObject(value) {
        this.true(() => this.check.isObject(value));
    }

    /**
        Asserts that the provided value is a reference type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isReference(value) {
        this.true(() => this.check.isReference(value));
    }

    /**
        Asserts that the provided value is a string type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True if the value is a string, false if not.
        @throws {error} An error is thrown if the assertion fails.
    */
    isString(value) {
        this.true(() => this.check.isString(value));
    }

    /**
        Asserts that the provided value is a provided type.

        @param {any} value The value on which to check the assertion.
        @param {string} type The name of the type for which to check.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isType(value, type) {
        this.true(() => this.check.isType(value, type));
    }

    /**
        Asserts that the provided value is a value (non-reference) type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isValue(value) {
        this.true(() => this.check.isValue(value));
    }
}
