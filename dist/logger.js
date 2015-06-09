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

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var requiredMethods = ["log"];

var LEVELS = {
    OFF: 0,
    STANDARD: 1,
    ERROR: 2,
    WARN: 3,
    INFO: 4,
    DEBUG: 5,
    SILLY: 6
};

exports.LEVELS = LEVELS;

var LogError = (function (_Error) {

    // silly way of properly extending an error

    function LogError(message) {
        _classCallCheck(this, LogError);

        _get(Object.getPrototypeOf(LogError.prototype), "constructor", this).call(this);
        Error.captureStackTrace(this, this.constructor);
        Object.defineProperty(this, "message", {
            value: message
        });
    }

    _inherits(LogError, _Error);

    _createClass(LogError, [{
        key: "name",
        get: function () {
            return this.constructor.name;
        }
    }]);

    return LogError;
})(Error);

exports.LogError = LogError;

var Logger = (function () {
    function Logger() {
        var _ref = arguments[0] === undefined ? {} : arguments[0];

        var _ref$level = _ref.level;
        var level = _ref$level === undefined ? LEVELS.STANDARD : _ref$level;
        var _ref$logInterface = _ref.logInterface;
        var logInterface = _ref$logInterface === undefined ? console : _ref$logInterface;

        _classCallCheck(this, Logger);

        this.level = level;
        if (!logInterface) throw new LogError("Provided logInterface did not exist!");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = requiredMethods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var method = _step.value;

                if (!logInterface[method] || !logInterface[method] instanceof Function) throw new LogError("The logInterface provided to Logger was missing a required method! Required: " + method);
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

        var newLogger = {};
        newLogger.log = logInterface.log.bind(logInterface);
        newLogger.error = typeof logInterface.error === "function" ? logInterface.error.bind(logInterface) : logInterface.log.bind(logInterface);
        newLogger.warn = typeof logInterface.warn === "function" ? logInterface.warn.bind(logInterface) : logInterface.log.bind(logInterface);
        newLogger.info = typeof logInterface.info === "function" ? logInterface.info.bind(logInterface) : logInterface.log.bind(logInterface);
        newLogger.debug = typeof logInterface.debug === "function" ? logInterface.debug.bind(logInterface) : logInterface.log.bind(logInterface);
        newLogger.silly = typeof logInterface.silly === "function" ? logInterface.silly.bind(logInterface) : logInterface.log.bind(logInterface);
        this.transport = newLogger;
    }

    _createClass(Logger, [{
        key: "log",
        value: function log() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (this.level >= LEVELS.STANDARD) return this.transport.log.apply(null, args);
        }
    }, {
        key: "error",
        value: function error() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (this.level >= LEVELS.ERROR) return this.transport.error.apply(null, args);
        }
    }, {
        key: "warn",
        value: function warn() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            if (this.level >= LEVELS.WARN) return this.transport.warn.apply(null, args);
        }
    }, {
        key: "info",
        value: function info() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            if (this.level >= LEVELS.INFO) return this.transport.info.apply(null, args);
        }
    }, {
        key: "debug",
        value: function debug() {
            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            if (this.level >= LEVELS.DEBUG) return this.transport.debug.apply(null, args);
        }
    }, {
        key: "silly",
        value: function silly() {
            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            if (this.level >= LEVELS.SILLY) return this.transport.silly.apply(null, args);
        }
    }]);

    return Logger;
})();

exports["default"] = Logger;