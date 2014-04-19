/*
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};

    var location = {};
    z.defineProperty(location, "parameters", {
        get: function() { return getParameters() }, // automatically re-search for query parameters when accessing
        writeable: false
    });

    var getParameters = function() {
        var params = {};
        var href = window.location.href;
        var indexOfQueries = href.indexOf("?");
        if (indexOfQueries > -1) {
            var queries = href.substring(indexOfQueries+1).split("&");
            for (var i = 0; i < queries.length; i++) {
                var query = queries[i].split("=");
                if (query.length != 2) continue;
                params[query[0]] = decodeURIComponent(query[1].replace(/\+/g, " "));
            }
        }
        return params;
    }

    z.location = location;
    w.util = z;
}(window || this));