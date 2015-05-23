/*
    @license
    Copyright (C) 2015 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

export default class Functions {

    constructor({ check }) {
        this.check = check;
    }

    /**
        Curries a function, allowing it to accept
        partial argument lists at differing times.

        @fn {function} The function to curry.
        @args {...any} The arguments to be curried, or to execute the function when all arguments are provided.
        @returns The curried function.
    */
    curry(fn, ...sourceArgs) {
        // could just use typeof to remove dependency on Check module, if desired
        if (!this.check.isFunction(fn))
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
}
