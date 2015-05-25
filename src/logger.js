/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

import check from './check.js';

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

export class Logger {

    constructor({
          level  = LEVELS.STANDARD
        , logInterface = console
    } = {})
    {
        this.level = level;
        if (!logInterface)
            throw new LogError('Provided logInterface did not exist!');
        for (let method of requiredMethods) {
            if (!logInterface[method] || !check.isFunction(logInterface[method]))
                throw new LogError(`The logInterface provided to Logger was missing a required method! Required: ${method}`);
        }
        let newLogger   = {};
        newLogger.log   = logInterface.log.bind(logInterface);
        newLogger.error = typeof logInterface.error === 'function' ? logInterface.error.bind(logInterface) : logInterface.log.bind(logInterface);
        newLogger.warn  = typeof logInterface.warn  === 'function' ? logInterface.warn.bind(logInterface)  : logInterface.log.bind(logInterface);
        newLogger.info  = typeof logInterface.info  === 'function' ? logInterface.info.bind(logInterface)  : logInterface.log.bind(logInterface);
        newLogger.debug = typeof logInterface.debug === 'function' ? logInterface.debug.bind(logInterface) : logInterface.log.bind(logInterface);
        newLogger.silly = typeof logInterface.silly === 'function' ? logInterface.silly.bind(logInterface) : logInterface.log.bind(logInterface);
        this.transport  = newLogger;
    }

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

let logger = new Logger();
export default logger;
