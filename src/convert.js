/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

import util from './util.js';
import check from './check.js';

export class Convert {

    constructor() {}

    /**
        Executes a conversion for a given source and type.

        @param {any} source The item to convert.
        @param {string} toType The type to which to convert.
        @returns {any} The converted source.
        @throws {error} An error is thrown if toType is not a string.
    */
    convert(source, toType) {
        switch (toType) {
            case util.types.boolean : return this.toBoolean(source);
            case util.types.date    : return this.toDate(source);
            case util.types.number  : return this.toNumber(source);
        }
        return source; // dangerous? throw error?
    }

    /**
        Executes a conversion to boolean for a given source.

        @param {any} source The item to convert.
        @returns {boolean} The converted source.
    */
    toBoolean(source) {
        if (check.exists(source) && check.isFunction(source.toBoolean))
            return source.toBoolean(); // allow override to be supplied directly on the source object
        switch (util.getType(source)) {
            case util.types.boolean:
                return source;
            case util.types.string:
                switch (source.toLowerCase().trim()) {
                    case "false":
                    case "0":
                    case "":
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
    };

    /**
        Executes a conversion to a date for a given source.

        @param {any} source The item to convert.
        @returns {date} The converted source.
    */
    toDate(source) {
        if (check.exists(source) && check.isFunction(source.toDate)) {
            return source.toDate();
        }
        switch (util.getType(source)) {
            case util.types.date:
                return source;
            case util.types.string:
                return new Date(Date.parse(source));
            default:
                return new Date(Date.parse(source.toString()));
        }
    };

    /**
        Executes a conversion to a number for a given source.

        @param {any} source The item to convert.
        @returns {boolean} The converted source.
    */
    toNumber(source) {
        if (check.exists(source) && check.isFunction(source.toNumber))
            return source.toNumber();
        switch (util.getType(source)) {
            case util.types.number:
                return source;
            default:
                return +source;
        }
    };
}

let convert = new Convert();
export default convert;
