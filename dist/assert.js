/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

// can we extend error to be AssertionError now?

var AssertionError = (function (_Error) {
    function AssertionError(message) {
        _classCallCheck(this, AssertionError);

        // necessary?
        _get(Object.getPrototypeOf(AssertionError.prototype), "constructor", this).call(this, message);
    }

    _inherits(AssertionError, _Error);

    return AssertionError;
})(Error);

exports.AssertionError = AssertionError;

var Assert = (function () {
    function Assert(_ref) {
        var check = _ref.check;

        _classCallCheck(this, Assert);

        this.argsNotNull = function () {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            this["true"](function () {
                return _this.check.argsNotNull.apply(null, args);
            });
        };

        this.check = check;

        // for (let method in check) {
        //     // well this doesn't work. wrapping all of check methods in assert seems fine. find a way.
        // }
    }

    _createClass(Assert, [{
        key: "is",
        value: function is(condition, expected) {
            var message = arguments[2] === undefined ? null : arguments[2];

            if (this.check.isFunction(condition)) {
                if (condition() !== expected) {
                    // or double equals?
                    if (message) throw new AssertionError(message);else {
                        var functionString = condition.toString();
                        var functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
                        throw new AssertionError("Assertion failed: " + functionBody);
                    }
                }
            } else {
                if (condition !== expected) {
                    if (message) throw new AssertionError(message);else throw new AssertionError("Assertion failed: " + String(condition));
                }
            }
        }
    }, {
        key: "true",
        value: function _true(condition) {
            var message = arguments[1] === undefined ? null : arguments[1];

            return this.is(condition, true, message);
        }
    }, {
        key: "false",
        value: function _false(condition) {
            var message = arguments[1] === undefined ? null : arguments[1];

            return this.is(condition, false, message);
        }
    }, {
        key: "exists",

        /**
            Asserts that the provided value is not equal to null or undefined.
              @param {any} value The value to check for null or undefined values.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the value is equal to null or undefined.
        */
        value: function exists(value) {
            var _this2 = this;

            this["true"](function () {
                return _this2.check.exists(value);
            });
        }
    }, {
        key: "isArray",

        /**
            Asserts that the provided value is an array type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isArray(value) {
            var _this3 = this;

            this["true"](function () {
                return _this3.check.isArray(value);
            });
        }
    }, {
        key: "isBoolean",

        /**
            Asserts that the provided value is a boolean type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isBoolean(value) {
            var _this4 = this;

            this["true"](function () {
                return _this4.check.isBoolean(value);
            });
        }
    }, {
        key: "isDate",

        /**
            Asserts that the provided value is a date type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isDate(value) {
            var _this5 = this;

            this["true"](function () {
                return _this5.check.isDate(value);
            });
        }
    }, {
        key: "isFunction",

        /**
            Asserts that the provided value is a function type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isFunction(value) {
            var _this6 = this;

            this["true"](function () {
                return _this6.check.isFunction(value);
            });
        }
    }, {
        key: "isIterable",
        value: function isIterable(value) {
            var _this7 = this;

            this["true"](function () {
                return _this7.check.isIterable(value);
            });
        }
    }, {
        key: "isNonEmptyArray",

        /**
            Asserts that the provided value is a non-empty array.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isNonEmptyArray(value) {
            var _this8 = this;

            this["true"](function () {
                return _this8.check.isNonEmptyArray(value);
            });
        }
    }, {
        key: "isNumber",

        /**
            Asserts that the provided value is a number type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isNumber(value) {
            var _this9 = this;

            this["true"](function () {
                return _this9.check.isNumber(value);
            });
        }
    }, {
        key: "isObject",

        /**
            Asserts that the provided value is an object type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isObject(value) {
            var _this10 = this;

            this["true"](function () {
                return _this10.check.isObject(value);
            });
        }
    }, {
        key: "isReference",

        /**
            Asserts that the provided value is a reference type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isReference(value) {
            var _this11 = this;

            this["true"](function () {
                return _this11.check.isReference(value);
            });
        }
    }, {
        key: "isString",

        /**
            Asserts that the provided value is a string type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True if the value is a string, false if not.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isString(value) {
            var _this12 = this;

            this["true"](function () {
                return _this12.check.isString(value);
            });
        }
    }, {
        key: "isType",

        /**
            Asserts that the provided value is a provided type.
              @param {any} value The value on which to check the assertion.
            @param {string} type The name of the type for which to check.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isType(value, type) {
            var _this13 = this;

            this["true"](function () {
                return _this13.check.isType(value, type);
            });
        }
    }, {
        key: "isValue",

        /**
            Asserts that the provided value is a value (non-reference) type.
              @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        value: function isValue(value) {
            var _this14 = this;

            this["true"](function () {
                return _this14.check.isValue(value);
            });
        }
    }]);

    return Assert;
})();

exports["default"] = Assert;

/**
    Asserts that all of the arguments provided for a method existing.
      @param {string} var_args The arguments provided to a method.
    @returns {boolean} True, if the assertion passes.
*/