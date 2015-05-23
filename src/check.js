/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

/**
    Container for all utility checking methods.

    @class Contains all utility checking methods.
*/
export default class Check {

    constructor({ util }) {
        this.util = util;
    }

    /**
        Checks that all of the arguments provided for a method existing.

        @param {string} var_args The arguments provided to a method.
        @returns {boolean} True, if the check passes.
    */
    argsNotNull(...args) {
        for (let arg of args) {
            if (arg == null)
                return false;
        }
        return true;
    }

    /**
        Checks that the provided value is considered to be empty.

        @param {any} value The value to check for emptiness.
        @returns {boolean} True, if the check passes.
    */
    empty(value) {
        if (!value)
            return true;
        if (value.length && value.length === 0) // covers strings, arrays, etc
            return true;
        switch (this.util.getType(value)) {
            case this.util.types.object:
                for (let prop in value) {
                    if (value.hasOwnProperty(prop))
                        return false;
                }
                return true;
        }
        // anything else to cover?
        return false;
    }

    /**
        Checks that the provided value is not equal to null or undefined.

        @param {any} value The value to check for null or undefined values.
        @returns {boolean} True, if the check passes.
    */
    exists(value) {
        return value != null;
    }

    /**
        Checks that the provided value is an array type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isArray(value) {
        return this.util.getType(value) === this.util.types.array;
    }

    /**
        Checks that the provided value is a boolean type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isBoolean(value) {
        return this.util.getType(value) === this.util.types.boolean;
    }

    /**
        Checks that the provided value is a date type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isDate(value) {
        return this.util.getType(value) === this.util.types.date;
    }

    /**
        Checks that the provided value is a function type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isFunction(value) {
        return this.util.getType(value) === this.util.types.function;
    }

    /**
        Checks that the provided value is a generator function type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isGeneratorFunction(value) {
        return this.util.getType(value) === this.util.types.function && value.isGenerator();
    }

    /**
        Checks that the provided value is an iterable type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isIterable(value) {
        if (!this.util.check.exists(value)) return false;
        return this.util.getType(value[Symbol.iterator]) === this.util.types.function; // useable?
        // let iterator = value[this.util.symbols.iterator] || (value.prototype ? value.prototype[this.util.symbols.iterator] : null); // will this always be on prototype?
        // return this.util.getType(iterator) === this.util.types.function;
    }

    /**
        Checks that the provided value is a non-empty array.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isNonEmptyArray(value) {
        // move to arrays?
        return (this.util.check.exists(value) && this.util.getType(value) === this.util.types.array && value.length > 0);
    }

    /**
        Checks that the provided value is a number type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isNumber(value) {
        return !isNaN(value);
    }

    /**
        Checks that the provided value is an object type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isObject(value) {
        return this.util.getType(value) === this.util.types.object;
    }

    /**
        Checks that the provided value is a reference type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isReference(value) {
        switch (this.util.getType(value)) {
            case this.util.types.array:
            case this.util.types.date:
            case this.util.types.function:
            case this.util.types.generator:
            case this.util.types.generatorFunction:
            case this.util.types.object:
            case this.util.types.regexp:
                return true;
            default:
                return false;
        }
    }

    /**
        Checks that the provided value is a string type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isString(value) {
        return this.util.getType(value) === this.util.types.string;
    }

    /**
        Checks that the provided value is a provided type.

        @param {any} value The value on which to check.
        @param {string} type The name of the type for which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isType(value, type) {
        return this.util.getType(value) === type;
    }

    /**
        Checks that the provided value is a value (non-reference) type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isValue(value) {
        switch (this.util.getType(value)) {
            case this.util.types.boolean:
            case this.util.types.null: // value or reference?
            case this.util.types.number:
            case this.util.types.string:
            case this.util.types.undefined: // value or reference?
                return true;
            default:
                return false;
        }
    }
}
