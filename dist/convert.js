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

var Convert = (function () {
    function Convert(_ref) {
        var util = _ref.util;
        var check = _ref.check;

        _classCallCheck(this, Convert);

        this.util = util;
        this.check = check;
    }

    _createClass(Convert, [{
        key: "convert",

        /**
            Executes a conversion for a given source and type.
              @param {any} source The item to convert.
            @param {string} toType The type to which to convert.
            @returns {any} The converted source.
            @throws {error} An error is thrown if toType is not a string.
        */
        value: function convert(source, toType) {
            switch (toType) {
                case this.util.types.boolean:
                    return this.toBoolean(source);
                case this.util.types.date:
                    return this.toDate(source);
                case this.util.types.number:
                    return this.toNumber(source);
            }
            return source; // dangerous? throw error?
        }
    }, {
        key: "toBoolean",

        /**
            Executes a conversion to boolean for a given source.
              @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        value: function toBoolean(source) {
            if (this.check.exists(source) && this.check.isFunction(source.toBoolean)) return source.toBoolean(); // allow override to be supplied directly on the source object
            switch (this.util.getType(source)) {
                case this.util.types.boolean:
                    return source;
                case this.util.types.string:
                    switch (source.toLowerCase().trim()) {
                        case "false":
                        case "0":
                        case "":
                        case null:
                        case undefined:
                            return false;
                        default:
                            return true;
                    }
                    break;
                default:
                    return !!source;
            }
        }
    }, {
        key: "toDate",

        /**
            Executes a conversion to a date for a given source.
              @param {any} source The item to convert.
            @returns {date} The converted source.
        */
        value: function toDate(source) {
            if (this.check.exists(source) && this.check.isFunction(source.toDate)) {
                return source.toDate();
            }
            switch (this.util.getType(source)) {
                case this.util.types.date:
                    return source;
                case this.util.types.string:
                    return new Date(Date.parse(source));
                default:
                    return new Date(Date.parse(source.toString()));
            }
        }
    }, {
        key: "toNumber",

        /**
            Executes a conversion to a number for a given source.
              @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        value: function toNumber(source) {
            if (this.check.exists(source) && this.check.isFunction(source.toNumber)) return source.toNumber();
            switch (this.util.getType(source)) {
                case this.util.types.number:
                    return source;
                default:
                    return +source;
            }
        }
    }]);

    return Convert;
})();

exports["default"] = Convert;
module.exports = exports["default"];