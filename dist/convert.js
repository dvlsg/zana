/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilJs = require('./util.js');

var _utilJs2 = _interopRequireDefault(_utilJs);

var _checkJs = require('./check.js');

var _checkJs2 = _interopRequireDefault(_checkJs);

var Convert = (function () {
    function Convert() {
        _classCallCheck(this, Convert);
    }

    _createClass(Convert, [{
        key: 'convert',

        /**
            Executes a conversion for a given source and type.
              @param {any} source The item to convert.
            @param {string} toType The type to which to convert.
            @returns {any} The converted source.
            @throws {error} An error is thrown if toType is not a string.
        */
        value: function convert(source, toType) {
            switch (toType) {
                case _utilJs2['default'].types.boolean:
                    return this.toBoolean(source);
                case _utilJs2['default'].types.date:
                    return this.toDate(source);
                case _utilJs2['default'].types.number:
                    return this.toNumber(source);
            }
            return source; // dangerous? throw error?
        }
    }, {
        key: 'toBoolean',

        /**
            Executes a conversion to boolean for a given source.
              @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        value: function toBoolean(source) {
            if (_checkJs2['default'].exists(source) && _checkJs2['default'].isFunction(source.toBoolean)) return source.toBoolean(); // allow override to be supplied directly on the source object
            switch (_utilJs2['default'].getType(source)) {
                case _utilJs2['default'].types.boolean:
                    return source;
                case _utilJs2['default'].types.string:
                    switch (source.toLowerCase().trim()) {
                        case 'false':
                        case '0':
                        case '':
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
        key: 'toDate',

        /**
            Executes a conversion to a date for a given source.
              @param {any} source The item to convert.
            @returns {date} The converted source.
        */
        value: function toDate(source) {
            if (_checkJs2['default'].exists(source) && _checkJs2['default'].isFunction(source.toDate)) {
                return source.toDate();
            }
            switch (_utilJs2['default'].getType(source)) {
                case _utilJs2['default'].types.date:
                    return source;
                case _utilJs2['default'].types.string:
                    return new Date(Date.parse(source));
                default:
                    return new Date(Date.parse(source.toString()));
            }
        }
    }, {
        key: 'toNumber',

        /**
            Executes a conversion to a number for a given source.
              @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        value: function toNumber(source) {
            if (_checkJs2['default'].exists(source) && _checkJs2['default'].isFunction(source.toNumber)) return source.toNumber();
            switch (_utilJs2['default'].getType(source)) {
                case _utilJs2['default'].types.number:
                    return source;
                default:
                    return +source;
            }
        }
    }]);

    return Convert;
})();

exports.Convert = Convert;

var convert = new Convert();
exports['default'] = convert;