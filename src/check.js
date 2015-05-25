/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

import util from './util.js';

/**
    Container for all utility checking methods.

    @class Contains all utility checking methods.
*/
export class Check {

    constructor() {}

    /**
        Checks that the provided value is considered to be empty.

        @param {any} value The value to check for emptiness.
        @returns {boolean} True, if the check passes.
    */
    empty(value) {
        if (!value)
            return true;
        if (this.exists(value.length) && value.length === 0) // covers strings, arrays, etc
            return true;
        switch (util.getType(value)) {
            case util.types.object:
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
        return util.getType(value) === util.types.array;
    }

    /**
        Checks that the provided value is a boolean type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isBoolean(value) {
        return util.getType(value) === util.types.boolean;
    }

    /**
        Checks that the provided value is a date type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isDate(value) {
        return util.getType(value) === util.types.date;
    }

    /**
        Checks that the provided value is a function type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isFunction(value) {
        return util.getType(value) === util.types.function;
    }

    /**
        Checks that the provided value is a generator function type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isGeneratorFunction(value) {
        return util.getType(value) === util.types.function && value.isGenerator();
    }

    /**
        Checks that the provided value is an iterable type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isIterable(value) {
        if (!util.check.exists(value)) return false;
        return util.getType(value[Symbol.iterator]) === util.types.function; // useable?
        // let iterator = value[util.symbols.iterator] || (value.prototype ? value.prototype[util.symbols.iterator] : null); // will this always be on prototype?
        // return util.getType(iterator) === util.types.function;
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
        return util.getType(value) === util.types.object;
    }

    /**
        Checks that the provided value is a reference type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isReference(value) {
        switch (util.getType(value)) {
            case util.types.array:
            case util.types.date:
            case util.types.function:
            case util.types.generator:
            case util.types.generatorFunction:
            case util.types.object:
            case util.types.regexp:
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
        return util.getType(value) === util.types.string;
    }

    /**
        Checks that the provided value is a provided type.

        @param {any} value The value on which to check.
        @param {string} type The name of the type for which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isType(value, type) {
        return util.getType(value) === type;
    }

    /**
        Checks that the provided value is a value (non-reference) type.

        @param {any} value The value on which to check.
        @returns {boolean} True if the check passes, false if not.
    */
    isValue(value) {
        switch (util.getType(value)) {
            case util.types.boolean:
            case util.types.null: // value or reference?
            case util.types.number:
            case util.types.string:
            case util.types.undefined: // value or reference?
                return true;
            default:
                return false;
        }
    }
}

let check = new Check();
export default check;
