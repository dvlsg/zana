/*
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};
    var log = z.log;

    /**
     * A static class wrapper to contain a stack of stopwatches.
     *
     * @class Represents a stack of currently executing tasks.
     */
    z.sw = function() {};
    z.sw.stopwatches = [];

    /**
     * Creates and pushes a new StopwatchWrapper onto the task
     * which contains the given taskDescription.
     * 
     * @param {string} taskDescription The description for the task to be timed.
     * @returns {void}
     */
    z.sw.push = function(taskDescription) {
        z.sw.stopwatches.push(new StopwatchWrapper(taskDescription));
    }

    /**
     * Pops the topmost executing StopwatchWrapper from the stack,
     * which in turn will log the execution time using util.log.
     * 
     * @param {string} taskDescription The description for the task to be timed.
     * @returns {void}
     */
    z.sw.pop = function() {
        if (z.sw.stopwatches.length > 0) {
            var sww = z.sw.stopwatches.pop();
            sww.stop();
            sww = null;
        }
    }

    //// "class-based" SwHelper
    //// use with var sw = new StopwatchStack();
    // function StopwatchStack() {
    //     var stopwatches = [];
    //     this.push = function(taskDescription) {
    //         stopwatches.push(new StopwatchWrapper(taskDescription));
    //     }
    //     this.pop = function() {
    //         if (stopwatches.length > 0) {
    //             var sww = stopwatches.pop();
    //             sww.stop();
    //             sww = null;
    //         }
    //     }
    // }

    /**
     * Creates a new StopwatchWrapper
     *
     * @class Represents a currently executing task.
     */
    function StopwatchWrapper(taskDescription) {
        var sw = new Stopwatch();
        var taskDesc = taskDescription || "";
        this.stop = function() {
            sw.stop();
            log.debug(taskDesc + " took: " + sw.duration() + " ms");
        }
        sw.start();
    }

    /**
     * Creates a new Stopwatch
     *
     * @class Represents a timer.
     */
    function Stopwatch() {
        var startTime = null;
        var stopTime = null;
        var running = false;

        /**
         * Starts the stopwatch.
         * 
         * @returns {void}
         */
        this.start = function() {
            if (!running) {
                stopTime = null;
                running = true;
                startTime = new Date().getTime();
            }
        }

        /**
         * Stops the stopwatch.
         * 
         * @returns {void}
         */
        this.stop = function() {
            if(running) {
                stopTime = new Date().getTime();
                running = false;
            }
        }

        /**
         * Collects the execution duration for the stopwatch.
         * 
         * @returns {number} The duration of the timer in milliseconds.
         */
        this.duration = function() {
            if (!running) {
                return (stopTime - startTime);
            }
            else {
                return (new Date().getTime() - startTime);
            }
        }

        /**
         * Resets the stopwatch to the initialized state. the execution duration for the stopwatch.
         * 
         * @returns {void}
         */
        this.reset = function() {
            running = false;
            startTime = null;
            stopTime = null;
        }
    }

    w.util = z;
}(window || this));