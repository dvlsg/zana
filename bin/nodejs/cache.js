/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {
        
        z.classes = z.classes || {};
        var slice = Array.prototype.slice;

        /**
            TBD

            @class TBD
        */
        var Cache = (function() {

            /**
                TBD
            */
            function Cache(options) {

                var _timeout, 
                    _lru,
                    _mru,
                    _length,
                    _cache;

                var accessor = function(key, value) {
                    z.assert.exists(key);
                    if (z.check.exists(value)) {
                        return set(key, value);
                    }
                    else {
                        return get(key);
                    }
                };

                var get = function(key) {
                    var obj = _cache[key];
                    if (z.check.exists(obj)) {
                        return _cache[key].data;
                    }
                    return null;
                };

                var peek = function(key) {
                    return _cache[key].data;
                };

                var set = function(key, value) {
                    _cache[key] = {
                        data: value,
                        args: null,
                        getter: null,
                        timestamp: new Date().getTime()
                    };
                    return _cache[key].data;
                };

                var set_refresh = function(key, getter) {
                    z.log("updating the cache with getter method...");
                    z.assert.isFunction(getter);
                    var args = Array.prototype.slice.call(arguments, 2);
                    var data = getter.apply(null, args);
                    _cache[key] = {
                        data: data,
                        args: args, // make a deep copy of args?
                        getter: getter,
                        timestamp: new Date().getTime()
                    };
                    return _cache[key].data;
                }

                var reset = function(opts) {
                    _cache = {};
                    _timeout = opts.timeout;
                    _lru = 0;
                    _mru = 0;
                    _length = 0;
                };
                reset(options);

                /**
                    @returns {function} The extended function.
                */
                return (function(cache) {
                    z.defineProperty(cache, "peek", { get: function() { return peek; }, writeable: false });
                    z.defineProperty(cache, "reset", { get: function() { return reset; }, writeable: false });
                    return cache;
                })(accessor);
            }

            return Cache;
            
        })();

        z.classes.Cache = Cache;
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
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());