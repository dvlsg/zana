/*
    @license
    Copyright (C) 2015 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
"use strict";

export class Stopwatch {

    constructor() {
        this.reset();
    }

    reset() {
        this.startTime = null;
        this.stopTime = null;
        this.running = false;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.stopTime = null;
            this.startTime = new Date().getTime();
        }
    }

    stop() {
        if (this.running) {
            this.running = false;
            this.stopTime = new Date().getTime();
        }
    }

    get duration() {
        if (!this.running && this.startTime && this.stopTime)
            return this.stopTime - this.startTime;
    }
}

export class StopwatchWrapper {

    constructor(description = "(UNKNOWN)") {
        this.sw = new Stopwatch();
        this.description = description;
        this.sw.start();
    }

    stop() {
        if (this.sw) {
            this.sw.stop();
            return `${this.description} took ${this.sw.duration} ms`;
        }
    }
}

export default class StopwatchStack {

    constructor() {
        this._stack = [];
    }

    push(description) {
        this._stack.push(new StopwatchWrapper(description));
    }

    pop() {
        if (this._stack.length > 0)
            return this._stack.pop().stop();
    }
}
