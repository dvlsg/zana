/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";


export default class Convert {

    constructor({ check, util }) {
        this.check = check;
        this.util = util;
    }

    /**
        Executes a conversion for a given source and type.

        @param {any} source The item to convert.
        @param {string} toType The type to which to convert.
        @returns {any} The converted source.
        @throws {error} An error is thrown if toType is not a string.
    */
    convert(source, toType) {
        switch (toType) {
            case this.util.types.boolean : return this.toBoolean(source);
            case this.util.types.date    : return this.toDate(source);
            case this.util.types.number  : return this.toNumber(source);
        }
        return source; // dangerous? throw error?
    }

    /**
        Executes a conversion to boolean for a given source.

        @param {any} source The item to convert.
        @returns {boolean} The converted source.
    */
    toBoolean(source) {
        if (this.check.exists(source) && this.check.isFunction(source.toBoolean))
            return source.toBoolean(); // allow override to be supplied directly on the source object
        switch (this.util.getType(source)) {
            case this.util.types.boolean:
                return source;
            case this.util.types.string:
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
        if (this.check.exists(source) && this.check.isFunction(source.toDate))
            return source.toDate();
        switch (this.util.getType(source)) {
            case this.util.types.date:
                return source;
            case this.util.types.string:
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
        if (this.check.exists(source) && this.check.isFunction(source.toNumber))
            return source.toNumber();
        switch (this.util.getType(source)) {
            case this.util.types.number:
                return source;
            default:
                return +source;
        }
    };
}
