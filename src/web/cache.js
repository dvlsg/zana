/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(z, undefined) {
    z.classes = z.classes || {};
    var slice = Array.prototype.slice;

    /**
        A wrapper class used to hold and execute different logging interfaces.
        Note that the provided log interface is expected to contain at least
        a debug, error, info, log, and warn method.

        @class Contains a provided logging interface.
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

            if (z.check.isNumber(options)) {
                options = {
                    timeout: options
                };
            }
            if (!z.check.exists(options)) {
                options = {
                    timeout: Number.POSITIVE_INFINITY
                };
            }
            z.assert.isObject(options);

            var accessor = function(key, getterOrValue) {
                z.assert.exists(key);
                if (z.check.exists(getterOrValue)) {
                    if (z.check.isFunction(getterOrValue)) {
                        return set_refresh.apply(null, [key, getterOrValue].concat(slice.call(arguments, 2)));
                    }
                    else {
                        return set(key, getterOrValue);
                    }
                }
                else {
                    return get(key);
                }
            };

            var get = function(key) {
                var obj = _cache[key];
                if (z.check.exists(obj)) {
                    if (obj.timestamp <= new Date().getTime() - _timeout) {
                        if (z.check.isFunction(obj.getter)) {
                            // refresh the cache
                            return set_refresh.apply(null, [key, obj.getter].concat(slice.call(obj.args)));
                        }
                        else {
                            // _cache[key] has expired, and does not have a method for auto-refresh
                            // what to do, what to do...
                        }
                    }
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

}(zUtil.prototype));