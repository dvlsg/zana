/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

let requiredMethods = [
    "log"
];

export const LEVELS = {
      OFF      : 0
    , STANDARD : 1
    , ERROR    : 2
    , WARN     : 3
    , INFO     : 4
    , DEBUG    : 5
    , SILLY    : 6
};

export class LogError extends Error {}

export default class Logger {

    constructor({ check, level = LEVELS.STANDARD, logger = console}) {
        this.check = check;
        this.level = level;
        // this._verify(logger);
        // this._bind(logger);

        if (!logger)
            throw new LogError('Provided logger did not exist!');
        for (let method of requiredMethods) {
            if (!logger[method] || !this.check.isFunction)
                throw new LogError(`The interface provided to Logger was missing a required method! Required: ${method}`);
        }
        let logInterface   = {};
        logInterface.log   = logger.log.bind(logger);
        logInterface.error = this.check.isFunction(logger.error) ? logger.error.bind(logger) : logger.log.bind(logger);
        logInterface.warn  = this.check.isFunction(logger.warn)  ? logger.warn.bind(logger)  : logger.log.bind(logger);
        logInterface.info  = this.check.isFunction(logger.info)  ? logger.info.bind(logger)  : logger.log.bind(logger);
        logInterface.debug = this.check.isFunction(logger.debug) ? logger.debug.bind(logger) : logger.log.bind(logger);
        logInterface.silly = this.check.isFunction(logger.silly) ? logger.silly.bind(logger) : logger.log.bind(logger);
        this.transport = logInterface;
    }

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

    log(...args) {
        if (this.level >= LEVELS.STANDARD)
            return this.transport.log.apply(null, args);
    }

    error(...args) {
        if (this.level >= LEVELS.ERROR)
            return this.transport.error.apply(null, args);
    }

    warn(...args) {
        if (this.level >= LEVELS.WARN)
            return this.transport.warn.apply(null, args);
    }

    info(...args) {
        if (this.level >= LEVELS.INFO)
            return this.transport.info.apply(null, args);
    }

    debug(...args) {
        if (this.level >= LEVELS.DEBUG)
            return this.transport.debug.apply(null, args);
    }

    silly(...args) {
        if (this.level >= LEVELS.SILLY)
            return this.transport.silly.apply(null, args);
    }
}
