/*
    @license
    Copyright (C) 2015 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stopwatch = (function () {
    function Stopwatch() {
        _classCallCheck(this, Stopwatch);

        this.reset();
    }

    _createClass(Stopwatch, [{
        key: "reset",
        value: function reset() {
            this.startTime = null;
            this.stopTime = null;
            this.running = false;
        }
    }, {
        key: "start",
        value: function start() {
            if (!this.running) {
                this.running = true;
                this.stopTime = null;
                this.startTime = new Date().getTime();
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.running) {
                this.running = false;
                this.stopTime = new Date().getTime();
            }
        }
    }, {
        key: "duration",
        get: function () {
            if (!this.running && this.startTime && this.stopTime) return this.stopTime - this.startTime;
        }
    }]);

    return Stopwatch;
})();

exports.Stopwatch = Stopwatch;

var StopwatchWrapper = (function () {
    function StopwatchWrapper() {
        var description = arguments[0] === undefined ? "(UNKNOWN)" : arguments[0];

        _classCallCheck(this, StopwatchWrapper);

        this.sw = new Stopwatch();
        this.description = description;
        this.sw.start();
    }

    _createClass(StopwatchWrapper, [{
        key: "stop",
        value: function stop() {
            if (this.sw) {
                this.sw.stop();
                return "" + this.description + " took " + this.sw.duration + " ms";
            }
        }
    }]);

    return StopwatchWrapper;
})();

exports.StopwatchWrapper = StopwatchWrapper;

var StopwatchStack = (function () {
    function StopwatchStack() {
        _classCallCheck(this, StopwatchStack);

        this._stack = [];
    }

    _createClass(StopwatchStack, [{
        key: "push",
        value: function push(description) {
            this._stack.push(new StopwatchWrapper(description));
        }
    }, {
        key: "pop",
        value: function pop() {
            if (this._stack.length > 0) return this._stack.pop().stop();
        }
    }]);

    return StopwatchStack;
})();

exports.StopwatchStack = StopwatchStack;

var sw = new StopwatchStack();
exports["default"] = sw;