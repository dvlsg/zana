/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    "use strict";
    function factory(z) {

        z.classes = z.classes || {};

        /**
            A wrapper class used to register and execute custom named events.

            @class Contains an internal list of registered events.
        */
        var Events = (function() {

            /**
                Creates a new Events class.

                @constructor
            */
            function Events() {

                var _eventList = [];

                /**
                    Calls any registered functions under the given event name,
                    passing any additional provided arguments to those functions.

                    @param {string} eventName The name of the event to emit.
                    @param {...any} var_args The arguments to pass to each of the registered events.
                    @returns {void}
                */
                var emit = function(eventName) {
                    var events = _eventList[eventName];
                    if (z.check.exists(events)) {
                        for (var i = 0; i < events.length; i++) {
                            var ev = events[i];
                            if (z.check.exists(ev.func)) {
                                ev.func.apply(null, Array.prototype.slice.call(arguments, 1));
                            }
                        }
                    }
                };

                /**
                    Clears all registered functions for a given event name.
                    passing any additional provided arguments to those functions.

                    @param {string} eventName The name of the event for which to clear events.
                    @returns {void}
                */
                var clear = function(eventName) {
                    z.check.exists(eventName);
                    _eventList[eventName] = null;
                };

                /**
                    Registers a function for a provided event name.
                    passing any additional provided arguments to those functions.

                    @param {string} eventName The name of the event on which to register the function.
                    @param {function} eventFunc The function to register for the event.
                    @returns {function} The function used to deregister the event which was just registered.
                */
                var on = function(eventName, eventFunc) {
                    z.check.exists(eventName);
                    z.check.isFunction(eventFunc);
                    var eventList = (_eventList[eventName] || (_eventList[eventName] = []));
                    var currentEvent = {
                        func: eventFunc
                    };
                    eventList.push(currentEvent);
                    var deregister = function() {
                        _eventList[eventName].removeAll(function(x) { return x === currentEvent; }); // remove only by reference
                    };
                    return deregister;
                };

                /**
                    Extends an object into a events interface with
                    the pre-determined, privately stored properties,
                    returning it back to the original Events() call.

                    @param {object} eventsObj The object to extend with Events properties.
                    @returns {object} The extended object.
                */
                return (function(eventsObj) {
                    z.defineProperty(eventsObj, "emit", { get: function() { return emit; }, writeable: false });
                    z.defineProperty(eventsObj, "clear", { get: function() { return clear; }, writeable: false });
                    z.defineProperty(eventsObj, "on", { get: function() { return on; }, writeable: false });
                    return eventsObj;
                })({});

            }

            return Events;

        })();

        z.classes.Events = Events;
        z.events = new z.classes.Events();
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