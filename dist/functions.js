/*
    @license
    Copyright (C) 2015 Dave Lesage
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

var _checkJs = require("./check.js");

var _checkJs2 = _interopRequireDefault(_checkJs);

var Functions = (function () {
    function Functions() {
        _classCallCheck(this, Functions);

        this.noop = function () {};
        this["true"] = function () {
            return true;
        };
        this["false"] = function () {
            return false;
        };
        this.identity = function (x) {
            return x;
        };
    }

    _createClass(Functions, [{
        key: "curry",

        /**
            Curries a function, allowing it to accept
            partial argument lists at differing times.
              @fn {function} The function to curry.
            @args {...any} The arguments to be curried, or to execute the function when all arguments are provided.
            @returns The curried function.
        */
        value: function curry(fn) {
            for (var _len = arguments.length, sourceArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                sourceArgs[_key - 1] = arguments[_key];
            }

            if (!_checkJs2["default"].isFunction(fn)) return fn;

            function curried(args) {
                if (args.length >= fn.length) return fn.apply(null, args);
                return function () {
                    for (var _len2 = arguments.length, innerArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        innerArgs[_key2] = arguments[_key2];
                    }

                    return curried(args.concat(innerArgs));
                };
            }
            return curried(sourceArgs);
        }
    }, {
        key: "debounce",
        value: function debounce(fn) {
            var wait = arguments[1] === undefined ? 0 : arguments[1];

            var timeout = null;
            return function () {
                clearTimeout(timeout);
                timeout = setTimeout(fn.bind(this, arguments), wait);
            };
        }
    }]);

    return Functions;
})();

exports["default"] = Functions;

var functions = new Functions();
exports["default"] = functions;
module.exports = exports["default"];