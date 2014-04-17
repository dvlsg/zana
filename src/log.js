/*
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};

    var Log = (function() {
        function Log(logger) {
            var _debug;
            var _error;
            var _info;
            var _log;
            var _warn;

            this.setLogger(logger);
            this.setDebugLogging(false);
        }

        var data = {
            expectedMethods: [
                "debug"
                , "error"
                , "info"
                , "log"
                , "warn"
            ]
        };

        var bindLoggers = function() {
            this._debug = this.logger.debug.bind(this.logger);
            this._error = this.logger.error.bind(this.logger);
            this._info = this.logger.info.bind(this.logger);
            this._log = this.logger.log.bind(this.logger);
            this._warn = this.logger.warn.bind(this.logger);
        };

        var defineProperties = function() {
            Object.defineProperty(Log.prototype, "debug", {
                "get": function() {
                    if (this.useDebugLogging) {
                        return this._debug;
                    }
                    else {
                        // efficiency? this will still get executed
                        // in its original context as an empty function
                        // even when debug is off.
                        return z.functions.empty; 
                    }
                }
            });
            Object.defineProperty(Log.prototype, "error", {
                "get": function() { return this._error; }
            });
            Object.defineProperty(Log.prototype, "info", {
                "get": function() { return this._info; }
            });
            Object.defineProperty(Log.prototype, "log", {
                "get": function() { return this._log; }
            });
            Object.defineProperty(Log.prototype, "warn", {
                "get": function() { return this._warn; }
            });
        };

        Log.prototype.setDebugLogging = function(useDebugLogging) {
            this.useDebugLogging = useDebugLogging;
        };

        Log.prototype.setLogger = function(newLogger) {
            z.check.exists(newLogger);
            for (var i = 0; i < data.expectedMethods.length; i++) {
                var method = data.expectedMethods[i];
                z.check.isFunction(newLogger[method]);
            }
            this.logger = newLogger;
            bindLoggers.apply(this);
            defineProperties();
        };

        return Log;
        
    })();

    z.log = new Log(console);
    w.util = z;
}(window || this));