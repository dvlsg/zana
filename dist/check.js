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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilJs = require("./util.js");

var _utilJs2 = _interopRequireDefault(_utilJs);

/**
    Container for all utility checking methods.

    @class Contains all utility checking methods.
*/

var Check = (function () {
    function Check() {
        _classCallCheck(this, Check);
    }

    _createClass(Check, [{
        key: "empty",

        /**
            Checks that the provided value is considered to be empty.
              @param {any} value The value to check for emptiness.
            @returns {boolean} True, if the check passes.
        */
        value: function empty(value) {
            if (!value) return true;
            if (this.exists(value.length) && value.length === 0) // covers strings, arrays, etc
                return true;
            switch (_utilJs2["default"].getType(value)) {
                case _utilJs2["default"].types.object:
                    for (var prop in value) {
                        if (value.hasOwnProperty(prop)) return false;
                    }
                    return true;
            }
            // anything else to cover?
            return false;
        }
    }, {
        key: "exists",

        /**
            Checks that the provided value is not equal to null or undefined.
              @param {any} value The value to check for null or undefined values.
            @returns {boolean} True, if the check passes.
        */
        value: function exists(value) {
            return value != null;
        }
    }, {
        key: "isArray",

        /**
            Checks that the provided value is an array type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isArray(value) {
            return _utilJs2["default"].getType(value) === _utilJs2["default"].types.array;
        }
    }, {
        key: "isBoolean",

        /**
            Checks that the provided value is a boolean type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isBoolean(value) {
            return _utilJs2["default"].getType(value) === _utilJs2["default"].types.boolean;
        }
    }, {
        key: "isDate",

        /**
            Checks that the provided value is a date type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isDate(value) {
            return _utilJs2["default"].getType(value) === _utilJs2["default"].types.date;
        }
    }, {
        key: "isFunction",

        /**
            Checks that the provided value is a function type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isFunction(value) {
            return _utilJs2["default"].getType(value) === _utilJs2["default"].types["function"];
        }
    }, {
        key: "isGeneratorFunction",

        /**
            Checks that the provided value is a generator function type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isGeneratorFunction(value) {
            return _utilJs2["default"].getType(value) === _utilJs2["default"].types["function"] && value.isGenerator();
        }
    }, {
        key: "isIterable",

        /**
            Checks that the provided value is an iterable type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isIterable(value) {
            if (!_utilJs2["default"].check.exists(value)) return false;
            return _utilJs2["default"].getType(value[Symbol.iterator]) === _utilJs2["default"].types["function"]; // useable?
            // let iterator = value[util.symbols.iterator] || (value.prototype ? value.prototype[util.symbols.iterator] : null); // will this always be on prototype?
            // return util.getType(iterator) === util.types.function;
        }
    }, {
        key: "isNumber",

        /**
            Checks that the provided value is a number type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isNumber(value) {
            return !isNaN(value);
        }
    }, {
        key: "isObject",

        /**
            Checks that the provided value is an object type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isObject(value) {
            return _utilJs2["default"].getType(value) === _utilJs2["default"].types.object;
        }
    }, {
        key: "isReference",

        /**
            Checks that the provided value is a reference type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isReference(value) {
            switch (_utilJs2["default"].getType(value)) {
                case _utilJs2["default"].types.array:
                case _utilJs2["default"].types.date:
                case _utilJs2["default"].types["function"]:
                case _utilJs2["default"].types.generator:
                case _utilJs2["default"].types.generatorFunction:
                case _utilJs2["default"].types.object:
                case _utilJs2["default"].types.regexp:
                    return true;
                default:
                    return false;
            }
        }
    }, {
        key: "isString",

        /**
            Checks that the provided value is a string type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isString(value) {
            return _utilJs2["default"].getType(value) === _utilJs2["default"].types.string;
        }
    }, {
        key: "isType",

        /**
            Checks that the provided value is a provided type.
              @param {any} value The value on which to check.
            @param {string} type The name of the type for which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isType(value, type) {
            return _utilJs2["default"].getType(value) === type;
        }
    }, {
        key: "isValue",

        /**
            Checks that the provided value is a value (non-reference) type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isValue(value) {
            switch (_utilJs2["default"].getType(value)) {
                case _utilJs2["default"].types.boolean:
                case _utilJs2["default"].types["null"]: // value or reference?
                case _utilJs2["default"].types.number:
                case _utilJs2["default"].types.string:
                case _utilJs2["default"].types.undefined:
                    // value or reference?
                    return true;
                default:
                    return false;
            }
        }
    }]);

    return Check;
})();

exports.Check = Check;

var check = new Check();
exports["default"] = check;