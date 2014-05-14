/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(w, undefined) {
    var z = w.util || {};
    z.classes = z.classes || {};

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
    var LogInterface = (function() {

        /**
            Creates a new Log class.

            @constructor
            @param {object} logger The interface containing the expected log methods.
            @param {bool} [enableDebugLogging] An override for enabling debug logging on Log class creation.
        */
        function LogInterface(logger, enableDebugLogging) {

            var _debug;
            var _error;
            var _info;
            var _log;
            var _warn;
            var _useDebugLogging;

            /**
                Binds the class's private variables
                to the provided logger interface methods.

                @param {object} loggerToBind The interface containing the expected log methods.
                @returns {void}
            */
            var bindLoggers = function(loggerToBind) {
                _debug = loggerToBind.debug.bind(loggerToBind);
                _error = loggerToBind.error.bind(loggerToBind);
                _info = loggerToBind.info.bind(loggerToBind);
                _log = loggerToBind.log.bind(loggerToBind);
                _warn = loggerToBind.warn.bind(loggerToBind);
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
                
                @param {object} newLogger The new logger interface.
                @returns {void}
            */
            var setLogger; (setLogger = function setLogger(newLogger) {
                verifyLoggerInterface(newLogger);
                bindLoggers(newLogger);
                setDebugLogging(enableDebugLogging != null ? enableDebugLogging : (z.location ? z.location.parameters["debug"] : false));
            })(logger);

            /**
                Extends a function into a log interface with
                the pre-determined, privately stored properties,
                returning it back to the original Log() call.

                @returns {function} The extended function.
            */
            return (function(newLog) {
                /**
                    The base LogInterface function to be returned.
                    Note that the base function can be called
                    as a pass-through method for the _log without
                    needing to directly call LogInterface.log()

                    Note: Using this method seems a LOT safer,
                    and prevents _log from containing a self-reference.
                    The downside is that the console call will be recorded 
                    as coming from this location in log.js,
                    instead of the util.log() line in client code.

                    @param {any} [x] The item to pass to the LogInterface.log() function.
                    @returns {any} The extended item.
                */
                // var newLog = function(x) {
                //     _log(x); // default a LogInterface(x) call to use _log(x)
                // };

                z.defineProperty(newLog, "debug", {
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
                z.defineProperty(newLog, "error", { get: function() { return _error; }, writeable: false });
                z.defineProperty(newLog, "info", { get: function() { return _info; }, writeable: false });
                z.defineProperty(newLog, "log", { get: function() { return _log; }, writeable: false });
                z.defineProperty(newLog, "warn", { get: function() { return _warn; }, writeable: false });
                z.defineProperty(newLog, "setDebugLogging", { get: function() { return setDebugLogging; }, writeable: false });
                z.defineProperty(newLog, "setLogger", { get: function() { return setLogger; }, writeable: false });
                return newLog;
            })(_log); // note these shenanigans -- seems dangerous, and _log will contain a self-reference
        }

        return LogInterface;
        
    })();

    z.classes.LogInterface = LogInterface;
    z.log = new z.classes.LogInterface(console); // add a default Log using the console as the logging interface
    w.util = z;
}(window || this));