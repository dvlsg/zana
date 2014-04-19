/*
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};

    var data = {
        expectedMethods: [
            "debug"
            , "error"
            , "info"
            , "log"
            , "warn"
        ]
    };

    /**
        An internal helper function used to determine
        whether or not the provided logger object
        is a proper interface for the Log class.
    
        @param {object} logger The log interface to check for expected methods
    */
    var verifyLoggerInterface = function(logger) {
        z.check.exists(logger);
        for (var i = 0; i < data.expectedMethods.length; i++) {
            var method = data.expectedMethods[i];
            z.check.isFunction(logger[method]);
        }
    };

    /**
        A wrapper class used to hold and execute different logging interfaces.
        Note that the provided log interface is expected to contain at least
        a debug, error, info, log, and warn method.

        @class Contains a provided logging interface.
     */
    var Log = (function() {

        /**
            Creates a new Log class.

            @constructor
            @param {object} logger The interface containing the expected log methods.
        */
        function Log(logger) {

            var _debug;
            var _error;
            var _info;
            var _log;
            var _warn;
            var _useDebugLogging;

            /**
                Binds the class's private variables
                to the provided logger interface methods.

                @param {object} logger The interface containing the expected log methods.
                @returns {void}
            */
            var bindLoggers = function(logger) {
                _debug = logger.debug.bind(logger);
                _error = logger.error.bind(logger);
                _info = logger.info.bind(logger);
                _log = logger.log.bind(logger);
                _warn = logger.warn.bind(logger);
            };

            /**
                Sets the use debug logging flag to the provided boolean.

                @param {boolean} useDebugLogging The boolean used to set the debug logging flag.
                @returns {void}
            */
            var setDebugLogging = function(useDebugLogging) {
                if (z.getType(useDebugLogging) === z.types.string) {
                    useDebugLogging = (function(str) {
                        switch (str.toLowerCase().trim()) {
                            case "false":
                            case "0":
                            case "":
                            case null:
                            case undefined:
                                return false;
                            default:
                                return true;
                        }
                    })(useDebugLogging);
                }
                _useDebugLogging = !!useDebugLogging;
            };

            /**
                Sets the already created log object
                to the newly provided logger interface.

                Note that method is also immediately executed
                to initialize the provided logger interface.
                
                @param {boolean} useDebugLogging The boolean used to set the debug logging flag.
                @returns {void}
            */
            (function setLogger(newLogger) {
                verifyLoggerInterface(logger);
                bindLoggers(newLogger);
                setDebugLogging(false); // default to false
            })(logger);

            /**
                Executes the IIFE is provided an empty object to extend
                with the pre-determined, privately stored properties, 
                and then returns the extended object to the original Log() call.

                @param {object} logObj The object to extend with Log properties.
                @returns {object} The extended object.
            */
            return (function(logObj) {
                z.defineProperty(logObj, "debug", {
                    get: function() { 
                        if (_useDebugLogging) {
                            return _debug;
                        }
                        else {
                            return z.functions.empty;
                        }
                    },
                    writeable: false
                });
                z.defineProperty(logObj, "error", { get: function() { return _error; }, writeable: false });
                z.defineProperty(logObj, "info", { get: function() { return _info; }, writeable: false });
                z.defineProperty(logObj, "log", { get: function() { return _log; }, writeable: false });
                z.defineProperty(logObj, "warn", { get: function() { return _warn; }, writeable: false });
                z.defineProperty(logObj, "setDebugLogging", { get: function() { return setDebugLogging; }, writeable: false });
                z.defineProperty(logObj, "setLogger", { get: function() { return setLogger; }, writeable: false });
                return logObj;
            })({});
        }

        return Log;
        
    })();

    z.log = new Log(console); // add a default Log using the console as the logging interface
    w.util = z;
}(window || this));