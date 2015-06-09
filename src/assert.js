/*
    @license
    Copyright (C) 2015 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

/* eslint no-unused-vars:0 */

let log = console.log.bind(console);

import Util from './util.js';
import Check from './check.js';

let util = new Util();
let check = new Check({util});

export class AssertionError extends Error {

    // silly way of properly extending an error
    constructor(message) {
        super();
        Error.captureStackTrace(this, this.constructor);
        Object.defineProperty(this, 'message', {
            value: message
        });
    }

    get name() {
        return this.constructor.name;
    }
}

export class Assertion {

    given: any;
    expected: any;
    test: Function;
    flipped: boolean;
    message: string;

    constructor({
          given
        , test     = x => {}
        , expected = null
        , flipped  = false
        , message  = null
    }) {
        this.given = given instanceof Function ? given : () => given;
        this.test = test;
        this.expected = expected;
        this.flipped = flipped;
        this.message = message;
    }

    get not() {
        this.flipped = !this.flipped;
        return this;
    }

    get is() {
        return this;
    }

    get to() {
        return this;
    }

    get be() {
        return this;
    }

    // todo: eventually

    empty() {
        this.test = (x, y) => check.empty(x()) === y;
        this.expected = true;
        this.assert();
    }

    ['throw'](name = null) {
        this.test = () => {
            try {
                this.given(); // can assume that given is a function here?
                return false;
            }
            catch(e) {
                if (!name) // don't care what type of error we caught
                    return true;
                if (name === e.name)
                    return true;

                // this is a little hacky..
                // any reason why name instanceof Error isn't working? (or even name.prototype for that matter?)
                if (name.prototype && util.getType(name.prototype) === util.getType(e))
                    return true;
                return false;
            }
        };
        this.expected = true;
        this.assert();
    }

    equal(target) {
        this.expected = target;
        this.test = (x, y) => util.equals(x(), y); // how can we handle this?
        this.assert();
    }

    assert() {
        let result = this.test(this.given, this.expected);
        if (this.flipped)
            result = !result;
        if (!result) {
            if(this.message)
                throw new AssertionError(this.message);
            else {
                let functionString = this.test.toString();
                let functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
                throw new AssertionError(`Assertion failed: ${functionBody}`);
            }
        }
    }
}

export default class Assert {

    // note, these could all really be methods
    constructor() {
        // check = check;
        // util = util;
    }

    // is(condition, expected, message = null) {
    //     if (check.isFunction(condition)) {
    //         if (condition() !== expected) { // or double equals?
    //             if(message)
    //                 throw new AssertionError(message);
    //             else {
    //                 let functionString = condition.toString();
    //                 let functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
    //                 throw new AssertionError(`Assertion failed: ${functionBody}`);
    //             }
    //         }
    //     }
    //     else {
    //         if (condition !== expected) {
    //             if (message)
    //                 throw new AssertionError(message);
    //             else
    //                 throw new AssertionError(`Assertion failed: ${String(condition)}`);
    //         }
    //     }
    // }

    true(value, message = null) {
        this.equal(value, true);
    }

    false(value, message = null) {
        return this.equal(value, false);
    }

    equal(val1, val2, message = null) {
        return this.expect(val1).to.equal(val2);
    }

    expect(value) {
        return new Assertion({
              given : value
            , util  : util
            , check : check
        });
    }

    /**
        Asserts that the provided value is empty.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    empty(value) {
        this.true(() => check.empty(value));
    }

    /**
        Asserts that the provided value is not empty.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    nonEmpty(value) {
        this.false(() => check.empty(value));
    }

    /**
        Asserts that the provided value is not equal to null or undefined.

        @param {any} value The value to check for null or undefined values.
        @throws {error} An error is thrown if the value is equal to null or undefined.
    */
    exists(value) {
        this.true(() => check.exists(value));
    }

    /**
        Asserts that the provided values are of the same type.

        @param {any} val1 The first value for type comparison.
        @param {any} val2 The second value for type comparison.
        @throws {error} An error is thrown if the types of the values are not equal.
    */
    is(val1, val2) {
        this.true(() => check.is(val1, val2));
    }

    /**
        Asserts that the provided value is an array type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isArray(value) {
        return value;
        // return this.expect(value).to.
        // return new Assertion({
        //     given: value,
        //     condition: () => check.isArray(value),
        //     expected: true
        // }).assert();
        // return new Assertion(() => check.isArray(value), true).assert();
        // this.true(() => check.isArray(value));
    }

    /**
        Asserts that the provided value is a boolean type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isBoolean(value) {
        this.true(() => check.isBoolean(value));
    }

    /**
        Asserts that the provided value is a date type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isDate(value) {
        this.true(() => check.isDate(value));
    }

    /**
        Asserts that the provided value is a function type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isFunction(value) {
        this.true(() => check.isFunction(value));
    }

    isIterable(value) {
        this.true(() => check.isIterable(value));
    }

    /**
        Asserts that the provided value is a number type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isNumber(value) {
        this.true(() => check.isNumber(value));
    }

    /**
        Asserts that the provided value is an object type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isObject(value) {
        this.true(() => check.isObject(value));
    }

    /**
        Asserts that the provided value is a reference type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isReference(value) {
        // useful? consider deprecating.
        this.true(() => check.isReference(value));
    }

    /**
        Asserts that the provided value is a string type.

        @param {any} value The value on which to check the assertion.
        @throws {error} An error is thrown if the assertion fails.
    */
    isString(value) {
        this.true(() => check.isString(value));
    }

    /**
        Asserts that the provided value is a provided type.

        @param {any} value The value on which to check the assertion.
        @param {string} type The name of the type for which to check.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isType(value, type) {
        this.true(() => check.isType(value, type));
    }

    /**
        Asserts that the provided value is a value (non-reference) type.

        @param {any} value The value on which to check the assertion.
        @returns {boolean} True, if the assertion passes.
        @throws {error} An error is thrown if the assertion fails.
    */
    isValue(value) {
        // useful? consider deprecating.
        this.true(() => check.isValue(value));
    }

    throws(fn, errType = null) {
        return this.expect(fn).to.throw(errType);
    }
}
