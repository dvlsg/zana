/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        /**
            A method used by the location.parameters property which builds the 
            window.location.href query parameters into an object containing key value pairs.

            @returns {object} The object containing query parameter key value pairs.
        */
        var _regexPlus = /\+/g; // define once
        var getParameters = function() {
            var params = {};
            if (typeof window !== 'undefined') {
                var href = window.location.href;
                var indexOfQueries = href.indexOf("?");
                if (indexOfQueries > -1) {
                    var queries = href.substring(indexOfQueries+1).split("&");
                    for (var i = 0; i < queries.length; i++) {
                        var query = queries[i].split("=");
                        if (query.length !== 2) continue;
                        params[query[0]] = decodeURIComponent(query[1].replace(_regexPlus, " "));
                    }
                }
            }
            return params;
        };

        /**
            A method used by the location.locale property which collects the locale from
            either the querystring parameters, or the navigator language and userLanguage properties.

            @returns {string} A string representation of the current locale.
        */
        var getLocale = function() {
            // note: "this" should be a pointer to the locationObj defined below
            return this.parameters.locale || navigator.language || navigator.userLanguage;
        };

        /**
            An interface class used with the window.location object.
            Note that the provided log interface is expected to contain at least
            a debug, error, info, log, and warn method.

            @class Contains a window.location interface.
        */
        var location = (function(locationObj) {
            z.defineProperty(locationObj, "parameters", { get: function() { return getParameters(); }, writeable: false });
            z.defineProperty(locationObj, "locale", { get: function() { return getLocale.call(this); }, writeable: false });
            return locationObj;
        })({});

        z.location = location;
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof global !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory; });
        root.z = z; // expose to root in case require() is not being used to load zana
    }
    else if (typeof module !== 'undefined') {
        if (typeof module.exports !== 'undefined') {
            module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }
}());