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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
    Container for all utility checking methods.

    @class Contains all utility checking methods.
*/

var Check = (function () {
    function Check(_ref) {
        var util = _ref.util;

        _classCallCheck(this, Check);

        this.util = util;
    }

    _createClass(Check, [{
        key: "argsNotNull",

        /**
            Checks that all of the arguments provided for a method existing.
              @param {string} var_args The arguments provided to a method.
            @returns {boolean} True, if the check passes.
        */
        value: function argsNotNull() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var arg = _step.value;

                    if (arg == null) return false;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return true;
        }
    }, {
        key: "empty",

        /**
            Checks that the provided value is considered to be empty.
              @param {any} value The value to check for emptiness.
            @returns {boolean} True, if the check passes.
        */
        value: function empty(value) {
            if (!value) return true;
            if (value.length && value.length === 0) // covers strings, arrays, etc
                return true;
            switch (this.util.getType(value)) {
                case this.util.types.object:
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
            return this.util.getType(value) === this.util.types.array;
        }
    }, {
        key: "isBoolean",

        /**
            Checks that the provided value is a boolean type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isBoolean(value) {
            return this.util.getType(value) === this.util.types.boolean;
        }
    }, {
        key: "isDate",

        /**
            Checks that the provided value is a date type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isDate(value) {
            return this.util.getType(value) === this.util.types.date;
        }
    }, {
        key: "isFunction",

        /**
            Checks that the provided value is a function type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isFunction(value) {
            return this.util.getType(value) === this.util.types["function"];
        }
    }, {
        key: "isGeneratorFunction",

        /**
            Checks that the provided value is a generator function type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isGeneratorFunction(value) {
            return this.util.getType(value) === this.util.types["function"] && value.isGenerator();
        }
    }, {
        key: "isIterable",

        /**
            Checks that the provided value is an iterable type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isIterable(value) {
            if (!this.util.check.exists(value)) return false;
            return this.util.getType(value[Symbol.iterator]) === this.util.types["function"]; // useable?
            // let iterator = value[this.util.symbols.iterator] || (value.prototype ? value.prototype[this.util.symbols.iterator] : null); // will this always be on prototype?
            // return this.util.getType(iterator) === this.util.types.function;
        }
    }, {
        key: "isNonEmptyArray",

        /**
            Checks that the provided value is a non-empty array.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isNonEmptyArray(value) {
            // move to arrays?
            return this.util.check.exists(value) && this.util.getType(value) === this.util.types.array && value.length > 0;
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
            return this.util.getType(value) === this.util.types.object;
        }
    }, {
        key: "isReference",

        /**
            Checks that the provided value is a reference type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isReference(value) {
            switch (this.util.getType(value)) {
                case this.util.types.array:
                case this.util.types.date:
                case this.util.types["function"]:
                case this.util.types.generator:
                case this.util.types.generatorFunction:
                case this.util.types.object:
                case this.util.types.regexp:
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
            return this.util.getType(value) === this.util.types.string;
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
            return this.util.getType(value) === type;
        }
    }, {
        key: "isValue",

        /**
            Checks that the provided value is a value (non-reference) type.
              @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        value: function isValue(value) {
            switch (this.util.getType(value)) {
                case this.util.types.boolean:
                case this.util.types["null"]: // value or reference?
                case this.util.types.number:
                case this.util.types.string:
                case this.util.types.undefined:
                    // value or reference?
                    return true;
                default:
                    return false;
            }
        }
    }]);

    return Check;
})();

exports["default"] = Check;
module.exports = exports["default"];