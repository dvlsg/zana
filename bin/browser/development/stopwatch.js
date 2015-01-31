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
            A class wrapper to contain a stack of stopwatches.
            
            @class Represents a stack of currently executing tasks.
        */
        var StopwatchStack = (function() {

            /**
                @constructor Initializes a new instance of the StopwatchStack class.
            */
            function StopwatchStack() {

                var _stopwatchStack = [];

                /**
                    Creates and pushes a new StopwatchWrapper onto the task
                    which contains the given taskDescription.
                
                    @param {string} taskDescription The description for the task to be timed.
                    @returns {void}
                */ 
                var _push = function(taskDescription) {
                    _stopwatchStack.push(new StopwatchWrapper(taskDescription));
                };

                /**
                    Pops the topmost executing StopwatchWrapper from the stack,
                    which in turn will log the execution time using util.log.
                 
                    @param {string} taskDescription The description for the task to be timed.
                    @returns {void}
                */
                var _pop = function() {
                    if (_stopwatchStack.length > 0)
                        return _stopwatchStack.pop().stop();
                };

                return (function(swObj) {
                    z.defineProperty(swObj, "push", { get: function() { return _push; }, writeable: false });
                    z.defineProperty(swObj, "pop", { get: function() { return _pop; }, writeable: false });
                    return swObj;
                })({});
            }

            return StopwatchStack;

        })();

        /**
            Creates a new StopwatchWrapper, designed to wrap
            the existing StopWatch class with a task description
            and a logging functionality.

            Used to keep the Stopwatch class clean,
            so it may be implemented without
            automated logging if necessary.

            @class Represents a currently executing task.
        */
        function StopwatchWrapper(taskDescription) {
            var sw = new Stopwatch();
            var taskDesc = taskDescription || "";

            this.stop = function() {
                var duration = sw.stop();
                z.log.debug(taskDesc + " took: " + duration + " ms");
                return duration;
            };
            
            sw.start();
        }

        /**
            Creates a new Stopwatch.
            
            @class Represents a timer.
        */
        function Stopwatch() {
            var _startTime = null;
            var _stopTime = null;
            var _running = false;

            /**
                Starts the stopwatch.
                
                @returns {void}
            */
            this.start = function() {
                if (!_running) {
                    _stopTime = null;
                    _running = true;
                    _startTime = new Date().getTime();
                }
            };

            /**
                Stops the stopwatch.
                
                @returns {void}
            */
            this.stop = function() {
                if(_running) {
                    _stopTime = new Date().getTime();
                    _running = false;
                }
                return this.duration();
            };

            /**
                Collects the execution duration for the stopwatch.
                
                @returns {number} The duration of the timer in milliseconds.
            */
            this.duration = function() {
                if (!_running)
                    return (_stopTime - _startTime);
                else
                    return (new Date().getTime() - _startTime);
            };

            /**
                Resets the stopwatch to the initialized state. the execution duration for the stopwatch.
                
                @returns {void}
            */
            this.reset = function() {
                _running = false;
                _startTime = null;
                _stopTime = null;
            };
        }

        z.classes.StopwatchStack = StopwatchStack;
        z.classes.StopwatchWrapper = StopwatchWrapper;
        z.classes.Stopwatch = Stopwatch;
        z.sw = new z.classes.StopwatchStack();
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