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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Functions = (function () {
    function Functions(_ref) {
        var check = _ref.check;

        _classCallCheck(this, Functions);

        this.check = check;
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

            // could just use typeof to remove dependency on Check module, if desired
            if (!this.check.isFunction(fn)) return fn;

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
    }]);

    return Functions;
})();

exports["default"] = Functions;
module.exports = exports["default"];