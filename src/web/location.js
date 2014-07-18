/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(z, undefined) {

    /**
        A method used by the location.parameters property which builds the 
        window.location.href query parameters into an object containing key value pairs.

        @returns {object} The object containing query parameter key value pairs.
    */
    var _regexPlus = /\+/g; // define once
    var getParameters = function() {
        var params = {};
        var href = window.location.href;
        var indexOfQueries = href.indexOf("?");
        if (indexOfQueries > -1) {
            var queries = href.substring(indexOfQueries+1).split("&");
            for (var i = 0; i < queries.length; i++) {
                var query = queries[i].split("=");
                if (query.length != 2) continue;
                params[query[0]] = decodeURIComponent(query[1].replace(_regexPlus, " "));
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
        z.defineProperty(locationObj, "parameters", { get: function() { return getParameters() }, writeable: false });
        z.defineProperty(locationObj, "locale", { get: function() { return getLocale.call(this) }, writeable: false });
        return locationObj;
    })({});

    z.location = location;
}(zUtil.prototype));