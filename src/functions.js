/*
    @license
    Copyright (C) 2015 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

import check from './check.js';

export default class Functions {

    noop     : Function;
    true     : Function;
    false    : Function;
    identity : Function;

    constructor() {
        this.noop     = ()  => {};
        this.true     = ()  => true;
        this.false    = ()  => false;
        this.identity = (x) => x;
    }

    /**
        Curries a function, allowing it to accept
        partial argument lists at differing times.

        @fn {function} The function to curry.
        @args {...any} The arguments to be curried, or to execute the function when all arguments are provided.
        @returns The curried function.
    */
    curry(fn, ...sourceArgs) {
        if (!check.isFunction(fn))
            return fn;

        function curried(args) {
            if (args.length >= fn.length)
                return fn.apply(null, args);
            return function(...innerArgs) {
                return curried(args.concat(innerArgs));
            };
        }
        return curried(sourceArgs);
    }

    debounce(fn, wait = 0): Function {
        let timeout = null;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(fn.bind(this, arguments), wait);
        };
    }
}

let functions = new Functions();
export default functions;
