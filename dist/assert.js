/*
    @license
    Copyright (C) 2015 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _utilJs = require('./util.js');

var _utilJs2 = _interopRequireDefault(_utilJs);

var _checkJs = require('./check.js');

var _checkJs2 = _interopRequireDefault(_checkJs);

/* eslint no-unused-vars:0 */

var log = console.log.bind(console);

var util = new _utilJs2['default']();
var check = new _checkJs2['default']({ util: util });

var AssertionError = (function (_Error) {

    // silly way of properly extending an error

    function AssertionError(message) {
        _classCallCheck(this, AssertionError);

        _get(Object.getPrototypeOf(AssertionError.prototype), 'constructor', this).call(this);
        Error.captureStackTrace(this, this.constructor);
        Object.defineProperty(this, 'message', {
            value: message
        });
    }

    _inherits(AssertionError, _Error);

    _createClass(AssertionError, [{
        key: 'name',
        get: function () {
            return this.constructor.name;
        }
    }]);

    return AssertionError;
})(Error);

exports.AssertionError = AssertionError;

var Assertion = (function () {
    function Assertion(_ref) {
        var given = _ref.given;
        var _ref$test = _ref.test;
        var test = _ref$test === undefined ? function (x) {} : _ref$test;
        var _ref$expected = _ref.expected;
        var expected = _ref$expected === undefined ? null : _ref$expected;
        var _ref$flipped = _ref.flipped;
        var flipped = _ref$flipped === undefined ? false : _ref$flipped;
        var _ref$message = _ref.message;
        var message = _ref$message === undefined ? null : _ref$message;

        _classCallCheck(this, Assertion);

        this.given = given instanceof Function ? given : function () {
            return given;
        };
        this.test = test;
        this.expected = expected;
        this.flipped = flipped;
        this.message = message;
    }

    _createClass(Assertion, [{
        key: 'not',
        get: function () {
            this.flipped = !this.flipped;
            return this;
        }
    }, {
        key: 'is',
        get: function () {
            return this;
        }
    }, {
        key: 'to',
        get: function () {
            return this;
        }
    }, {
        key: 'be',
        get: function () {
            return this;
        }
    }, {
        key: 'empty',

        // todo: eventually

        value: function empty() {
            this.test = function (x, y) {
                return check.empty(x()) === y;
            };
            this.expected = true;
            this.assert();
        }
    }, {
        key: 'throw',
        value: function _throw() {
            var _this = this;

            var name = arguments[0] === undefined ? null : arguments[0];

            this.test = function () {
                try {
                    _this.given(); // can assume that given is a function here?
                    return false;
                } catch (e) {
                    if (!name) // don't care what type of error we caught
                        return true;
                    if (name === e.name) return true;

                    // this is a little hacky..
                    // any reason why name instanceof Error isn't working? (or even name.prototype for that matter?)
                    if (name.prototype && util.getType(name.prototype) === util.getType(e)) return true;
                    return false;
                }
            };
            this.expected = true;
            this.assert();
        }
    }, {
        key: 'equal',
        value: function equal(target) {
            this.expected = target;
            this.test = function (x, y) {
                return util.equals(x(), y);
            }; // how can we handle this?
            this.assert();
        }
    }, {
        key: 'assert',
        value: function assert() {
            var result = this.test(this.given, this.expected);
            if (this.flipped) result = !result;
            if (!result) {
                if (this.message) throw new AssertionError(this.message);else {
                    var functionString = this.test.toString();
                    var functionBody = functionString.substring(functionString.indexOf('{') + 1, functionString.lastIndexOf('}')).trim();
                    throw new AssertionError('Assertion failed: ' + functionBody);
                }
            }
        }
    }]);

    return Assertion;
})();

exports.Assertion = Assertion;

var Assert = (function () {

    // note, these could all really be methods

    function Assert() {
        _classCallCheck(this, Assert);
    }

    _createClass(Assert, [{
        key: 'true',

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

        value: function _true(value) {
            var message = arguments[1] === undefined ? null : arguments[1];

            this.equal(value, true);
        }
    }, {
        key: 'false',
        value: function _false(value) {
            var message = arguments[1] === undefined ? null : arguments[1];

            return this.equal(value, false);
        }
    }, {
        key: 'equal',
        value: function equal(val1, val2) {
            var message = arguments[2] === undefined ? null : arguments[2];

            return this.expect(val1).to.equal(val2);
        }
    }, {
        key: 'expect',
        value: function expect(value) {
            return new Assertion({
                given: value,
                util: util,
                check: check
            });
        }
    }, {
        key: 'empty',

        /**
            Asserts that the provided value is empty.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function empty(value) {
            this['true'](function () {
                return check.empty(value);
            });
        }
    }, {
        key: 'nonEmpty',

        /**
            Asserts that the provided value is not empty.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function nonEmpty(value) {
            this['false'](function () {
                return check.empty(value);
            });
        }
    }, {
        key: 'exists',

        /**
            Asserts that the provided value is not equal to null or undefined.
              @param {any} value The value to check for null or undefined values.
            @throws {error} An error is thrown if the value is equal to null or undefined.
        */
        value: function exists(value) {
            this['true'](function () {
                return check.exists(value);
            });
        }
    }, {
        key: 'is',

        /**
            Asserts that the provided values are of the same type.
              @param {any} val1 The first value for type comparison.
            @param {any} val2 The second value for type comparison.
            @throws {error} An error is thrown if the types of the values are not equal.
        */
        value: function is(val1, val2) {
            this['true'](function () {
                return check.is(val1, val2);
            });
        }
    }, {
        key: 'isArray',

        /**
            Asserts that the provided value is an array type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isArray(value) {
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
    }, {
        key: 'isBoolean',

        /**
            Asserts that the provided value is a boolean type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isBoolean(value) {
            this['true'](function () {
                return check.isBoolean(value);
            });
        }
    }, {
        key: 'isDate',

        /**
            Asserts that the provided value is a date type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isDate(value) {
            this['true'](function () {
                return check.isDate(value);
            });
        }
    }, {
        key: 'isFunction',

        /**
            Asserts that the provided value is a function type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isFunction(value) {
            this['true'](function () {
                return check.isFunction(value);
            });
        }
    }, {
        key: 'isIterable',
        value: function isIterable(value) {
            this['true'](function () {
                return check.isIterable(value);
            });
        }
    }, {
        key: 'isNumber',

        /**
            Asserts that the provided value is a number type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isNumber(value) {
            this['true'](function () {
                return check.isNumber(value);
            });
        }
    }, {
        key: 'isObject',

        /**
            Asserts that the provided value is an object type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isObject(value) {
            this['true'](function () {
                return check.isObject(value);
            });
        }
    }, {
        key: 'isReference',

        /**
            Asserts that the provided value is a reference type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isReference(value) {
            // useful? consider deprecating.
            this['true'](function () {
                return check.isReference(value);
            });
        }
    }, {
        key: 'isString',

        /**
            Asserts that the provided value is a string type.
              @param {any} value The value on which to check the assertion.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isString(value) {
            this['true'](function () {
                return check.isString(value);
            });
        }
    }, {
        key: 'isType',

        /**
            Asserts that the provided value is a provided type.
              @param {any} value The value on which to check the assertion.
            @param {string} type The name of the type for which to check.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isType(value, type) {
            this['true'](function () {
                return check.isType(value, type);
            });
        }
    }, {
        key: 'isValue',

        /**
            Asserts that the provided value is a value (non-reference) type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isValue(value) {
            // useful? consider deprecating.
            this['true'](function () {
                return check.isValue(value);
            });
        }
    }, {
        key: 'throws',
        value: function throws(fn) {
            var errType = arguments[1] === undefined ? null : arguments[1];

            return this.expect(fn).to['throw'](errType);
        }
    }]);

    return Assert;
})();

exports['default'] = Assert;

// check = check;
// util = util;