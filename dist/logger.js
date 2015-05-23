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
    function LogError() {
        _classCallCheck(this, LogError);

        if (_Error != null) {
            _Error.apply(this, arguments);
        }
    }

    _inherits(LogError, _Error);

    return LogError;
})(Error);

exports.LogError = LogError;

var Logger = (function () {
    function Logger(_ref) {
        var check = _ref.check;
        var _ref$level = _ref.level;
        var level = _ref$level === undefined ? LEVELS.STANDARD : _ref$level;
        var _ref$logger = _ref.logger;
        var logger = _ref$logger === undefined ? console : _ref$logger;

        _classCallCheck(this, Logger);

        this.check = check;
        this.level = level;
        // this._verify(logger);
        // this._bind(logger);

        if (!logger) throw new LogError("Provided logger did not exist!");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = requiredMethods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var method = _step.value;

                if (!logger[method] || !this.check.isFunction) throw new LogError("The interface provided to Logger was missing a required method! Required: " + method);
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

        var logInterface = {};
        logInterface.log = logger.log.bind(logger);
        logInterface.error = this.check.isFunction(logger.error) ? logger.error.bind(logger) : logger.log.bind(logger);
        logInterface.warn = this.check.isFunction(logger.warn) ? logger.warn.bind(logger) : logger.log.bind(logger);
        logInterface.info = this.check.isFunction(logger.info) ? logger.info.bind(logger) : logger.log.bind(logger);
        logInterface.debug = this.check.isFunction(logger.debug) ? logger.debug.bind(logger) : logger.log.bind(logger);
        logInterface.silly = this.check.isFunction(logger.silly) ? logger.silly.bind(logger) : logger.log.bind(logger);
        this.transport = logInterface;
    }

    _createClass(Logger, [{
        key: "log",

        // _verify(logger) {
        //     if (!logger)
        //         throw new LogError('Provided logger did not exist!');
        //     for (let method of requiredMethods) {
        //         if (!logger[method] || !this.check.isFunction)
        //             throw new LogError(`The interface provided to Logger was missing a required method! Required: ${method}`);
        //     }
        // }

        // _bind(logger) {
        //     let logInterface   = {};
        //     logInterface.log   = logger.log.bind(logger);
        //     logInterface.error = this.check.isFunction(logger.error) ? logger.error.bind(logger) : logger.log.bind(logger);
        //     logInterface.warn  = this.check.isFunction(logger.warn)  ? logger.warn.bind(logger)  : logger.log.bind(logger);
        //     logInterface.info  = this.check.isFunction(logger.info)  ? logger.info.bind(logger)  : logger.log.bind(logger);
        //     logInterface.debug = this.check.isFunction(logger.debug) ? logger.debug.bind(logger) : logger.log.bind(logger);
        //     logInterface.silly = this.check.isFunction(logger.silly) ? logger.silly.bind(logger) : logger.log.bind(logger);
        //     this.transport = logInterface;
        // }

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