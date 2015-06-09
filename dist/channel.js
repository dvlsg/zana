'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint no-cond-assign: 0 */ // intentional while loop assign in flush
/* eslint no-unused-vars: 0 */ // so we can have log, even when not using it
/* eslint no-empty: 0 */ // intentional empty block inside Channel.produce()

var _dataStructuresJs = require('./data-structures.js');

var log = console.log.bind(console);

/*
    Three possible states:

    OPEN   : The Channel can be written to and taken from freely.
    CLOSED : The Channel can no longer be written to, but still has values to be taken.
    ENDED  : The Channel is closed, and no longer has values to be taken.
*/
var STATES = {
    OPEN: Symbol('channel_open'),
    CLOSED: Symbol('channel_closed'),
    ENDED: Symbol('channel_ended')
};

exports.STATES = STATES;
var ACTIONS = {
    // channel has just been closed, and has no more values to take
    DONE: Symbol('channel_done')
};

exports.ACTIONS = ACTIONS;
/*
    Error expose method to assist with ensuring
    that error messages are properly thrown instead of swallowed.

    setTimeout is used to ensure that the error is thrown
    from a location that will not be eaten by an async throw.
*/
function expose(e) {
    setTimeout(function () {
        throw e;
    });
}

/*
    Shifts and returns a value inside the channel
    from either the buffer or the puts.
*/
function shift(ch) {
    if (ch.empty())
        // this error is never expected to be thrown
        // just a sanity check during development
        throw new Error('Attempted to execute shift(Channel) on an empty channel!');

    if (ch.buf.empty()) {
        ch.puts.shift()();
        return ch.buf.shift();
    } else {
        var val = ch.buf.shift();
        if (!ch.puts.empty()) ch.puts.shift()();
        return val;
    }
}

/*
    Flushes out any remaining takes from the channel
    by sending them the value of `ACTIONS.DONE`.
*/
function flush(ch) {
    if (!ch.empty())
        // this error is never expected to be thrown
        // just a sanity check during development
        throw new Error('Attempted to execute flush(Channel) on a non-empty channel!');

    var take = null;
    while (take = ch.takes.shift()) take(ACTIONS.DONE);
}

/*
    Marks a channel as ended, and signals any promises
    which are waiting for the end of the channel.
*/
function finish(ch) {
    ch.state = STATES.ENDED;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = ch.waiting[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _waiting = _step.value;

            _waiting();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function timeout() {
    var delay = arguments[0] === undefined ? 0 : arguments[0];

    return new Promise(function (resolve, reject) {
        setTimeout(resolve, delay);
    });
}

var STATE = Symbol('channel_state');

var Channel = (function () {

    /*
        Default constructor for a Channel.
          Accepts an optional size for the internal buffer,
        and an optional transform function to be used by the Channel.
    */

    function Channel() {
        var size = arguments[0] === undefined ? Channel.DEFAULT_SIZE : arguments[0];
        var transform = arguments[1] === undefined ? function (x) {
            return x;
        } : arguments[1];

        _classCallCheck(this, Channel);

        this.puts = new _dataStructuresJs.Queue();
        this.takes = new _dataStructuresJs.Queue();
        this.buf = new _dataStructuresJs.FixedQueue(size);
        this.transform = transform;
        this.pipeline = [];
        this.waiting = [];
        this[STATE] = STATES.OPEN;
    }

    _createClass(Channel, [{
        key: 'state',

        /*
            Sets the state of the channel.
        */
        set: function (val) {
            this[STATE] = val;
        },

        /*
            Gets the state of the channel.
        */
        get: function () {
            return this[STATE];
        }
    }, {
        key: 'close',

        /*
            Calls Channel.close for `this`, `all`.
        */
        value: function close() {
            var all = arguments[0] === undefined ? false : arguments[0];

            Channel.close(this, all);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            Channel.destroy(this);
        }
    }, {
        key: 'empty',

        /*
            Returns Channel.empty for `this`.
        */
        value: function empty() {
            return Channel.empty(this);
        }
    }, {
        key: 'put',

        /*
            Returns Channel.put for `this`, `val`.
        */
        value: function put(val) {
            return Channel.put(this, val);
        }
    }, {
        key: 'take',

        /*
            Returns Channel.take for `this`.
        */
        value: function take() {
            return Channel.take(this);
        }
    }, {
        key: 'produce',

        /*
            Calls Channel.produce for `this`, `producer`.
        */
        value: function produce(producer) {
            return Channel.produce(this, producer);
        }
    }, {
        key: 'consume',

        /*
            Calls Channel.consume for `this`, `consumer`.
        */
        value: function consume() {
            var consumer = arguments[0] === undefined ? function () {} : arguments[0];

            return Channel.consume(this, consumer);
        }
    }, {
        key: 'done',

        /*
            Returns Channel.done for `this`.
        */
        value: function done() {
            return Channel.done(this);
        }
    }, {
        key: 'pipe',

        /*
            Returns Channel.pipe for `this`, `...channels`.
        */
        value: function pipe() {
            for (var _len = arguments.length, channels = Array(_len), _key = 0; _key < _len; _key++) {
                channels[_key] = arguments[_key];
            }

            return Channel.pipe.apply(Channel, [this].concat(channels));
        }
    }, {
        key: 'merge',

        /*
            Returns Channel.merge for `this`, `...channels`.
        */
        value: function merge() {
            for (var _len2 = arguments.length, channels = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                channels[_key2] = arguments[_key2];
            }

            return Channel.merge.apply(Channel, [this].concat(channels));
        }
    }, {
        key: 'unpipe',
        value: function unpipe() {
            for (var _len3 = arguments.length, channels = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                channels[_key3] = arguments[_key3];
            }

            return Channel.unpipe.apply(Channel, [this].concat(channels));
        }
    }], [{
        key: 'from',

        /*
            A helper constructor which will convert any iterable into a channel,
            placing all of the iterable's values onto that channel.
        */
        value: function from(iterable) {
            var keepOpen = arguments[1] === undefined ? false : arguments[1];

            var ch = new Channel();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = iterable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var val = _step2.value;

                    ch.put(val);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (!keepOpen) ch.close();
            return ch;
        }
    }, {
        key: 'close',

        /*
            Marks a channel to no longer be writable.
              Accepts an optional boolean `all`, to signify
            whether or not to close the entire pipeline.
        */
        value: function close(ch) {
            var all = arguments[1] === undefined ? false : arguments[1];

            ch.state = STATES.CLOSED;
            if (ch.empty()) {
                flush(ch);
                finish(ch);
            }
            // if (ch.cancel)
            //     ch.cancel(); // shut down the top part of the pipeline -- necessary?
            if (all) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = ch.pipeline[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var pipe = _step3.value;

                        pipe.close(all);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                            _iterator3['return']();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }
    }, {
        key: 'destroy',
        value: function destroy(ch) {
            Channel.close(ch, true);
        }
    }, {
        key: 'empty',

        /*
            Determines if a channel
            has any values left for `take` to use.
        */
        value: function empty(ch) {
            return ch.buf.empty() && ch.puts.empty();
        }
    }, {
        key: 'put',

        /*
            Places a new value onto the provided channel.
              If the buffer is full, the promise will be pushed
            onto Channel.puts to be resolved when buffer space is available.
        */
        value: function put(ch, val) {
            return new Promise(function (resolve) {
                if (val === ACTIONS.DONE) {
                    log('put received ACTIONS.DONE');
                    resolve(val);
                    return ch.close(); // good? bad?
                }
                if (ch.state !== STATES.OPEN) return resolve(ACTIONS.DONE);
                ch.puts.push(function () {
                    val = ch.transform(val);
                    ch.buf.push(val); // need val to be scoped for later execution
                    resolve();
                });
                if (!ch.buf.full()) {
                    var put = ch.puts.shift();
                    process.nextTick(put); // not helping our spinlock problem
                    // (ch.puts.shift())(); // execute the put immediately
                }
                if (!ch.takes.empty()) {
                    (function () {
                        var take = ch.takes.shift();
                        // let next = shift(ch);
                        process.nextTick(function () {
                            return take(shift(ch));
                        }); // super dangerous
                        // ch.takes.shift()(shift(ch)); // shift the next val from the channel, place it on the next take
                    })();
                }
            });
        }
    }, {
        key: 'take',

        /*
            Takes the first value from the provided channel.
              If no value is provided, the promise will be pushed
            onto Channel.takes to be resolved when a value is available.
        */
        value: function take(ch) {
            return new Promise(function (resolve) {
                if (ch.state === STATES.ENDED) return resolve(Channel.DONE);
                ch.takes.push(function (x) {
                    return resolve(x);
                });
                if (!ch.empty()) {
                    var val = shift(ch);
                    var take = ch.takes.shift();
                    take(val);
                } else {
                    if (ch.state === STATES.CLOSED) {
                        flush(ch);
                        finish(ch); // order?
                    }
                }
            });
        }
    }, {
        key: 'produce',

        /*
            Helper method for putting values onto a channel
            from a provided producer whenever there is space.
              CAREFUL WITH THIS.
            Right now, if we produce methods that can be run without any delay whatsoever,
            it is impossible to break out of the loop using regeneratorRuntime,
            even if we await timeout() then close the channel -- the await timeout() will never be passed.
        */
        value: function produce(ch, producer) {
            var spin;
            return regeneratorRuntime.async(function produce$(context$2$0) {
                var _this = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        spin = true;

                        (function callee$2$0() {
                            var val, r;
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        context$3$0.prev = 0;

                                    case 1:
                                        if (!spin) {
                                            context$3$0.next = 18;
                                            break;
                                        }

                                        val = producer();

                                        if (!(val instanceof Promise)) {
                                            context$3$0.next = 9;
                                            break;
                                        }

                                        context$3$0.next = 6;
                                        return val;

                                    case 6:
                                        val = context$3$0.sent;
                                        context$3$0.next = 11;
                                        break;

                                    case 9:
                                        context$3$0.next = 11;
                                        return timeout();

                                    case 11:
                                        context$3$0.next = 13;
                                        return ch.put(val);

                                    case 13:
                                        r = context$3$0.sent;

                                        if (!(r === Channel.DONE)) {
                                            context$3$0.next = 16;
                                            break;
                                        }

                                        return context$3$0.abrupt('break', 18);

                                    case 16:
                                        context$3$0.next = 1;
                                        break;

                                    case 18:
                                        context$3$0.next = 23;
                                        break;

                                    case 20:
                                        context$3$0.prev = 20;
                                        context$3$0.t0 = context$3$0['catch'](0);

                                        expose(context$3$0.t0);

                                    case 23:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this, [[0, 20]]);
                        })();
                        return context$2$0.abrupt('return', function () {
                            spin = false;
                        });

                    case 3:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }
    }, {
        key: 'consume',

        /*
            Helper method for executing a provided consumer
            each time a channel value is available.
        */
        value: function consume(ch) {
            var consumer = arguments[1] === undefined ? function () {} // noop default
            : arguments[1];
            var spin;
            return regeneratorRuntime.async(function consume$(context$2$0) {
                var _this2 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        spin = true;

                        (function callee$2$0() {
                            var val;
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        val = null;

                                    case 1:
                                        context$3$0.next = 3;
                                        return ch.take();

                                    case 3:
                                        context$3$0.t0 = val = context$3$0.sent;

                                        if (!(context$3$0.t0 !== Channel.DONE)) {
                                            context$3$0.next = 8;
                                            break;
                                        }

                                        try {
                                            consumer(val); // this technically does not need to be awaited. will most likely be synchronous.
                                        } catch (e) {
                                            expose(e);
                                        }
                                        context$3$0.next = 1;
                                        break;

                                    case 8:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this2);
                        })();
                        return context$2$0.abrupt('return', function () {
                            spin = false;
                        });

                    case 3:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }
    }, {
        key: 'done',

        /*
            Registers a promise to be resolved
            when the channel has fully ended.
        */
        value: function done(ch) {
            return new Promise(function (resolve, reject) {
                if (ch.state === STATES.ENDED) return resolve();else ch.waiting.push(function () {
                    resolve();
                });
            });
        }
    }, {
        key: 'pipeline',

        /*
            Automatically builds a set of channels
            for the provided function arguments,
            setting up a pipe from the first channel
            all the way down to the last channel.
              Returns references to both
            the first and the last channel.
        */
        value: function pipeline() {
            for (var _len4 = arguments.length, functions = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                functions[_key4] = arguments[_key4];
            }

            var channels = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = functions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var fn = _step4.value;

                    channels.push(new Channel(1, fn));
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                        _iterator4['return']();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            channels.reduce(function (x, y) {
                return x.pipe(y);
            });
            return [channels[0], channels[channels.length - 1]];
        }
    }, {
        key: 'pipe',

        /*
            Builds a pipeline from a parent channel
            to one or more children.
              This will automatically pipe values from
            the parent onto each of the children.
              (dev note: careful, errors which are thrown from here
             do NOT bubble up to the user yet in nodejs.
             will be fixed in the future, supposedly).
        */
        value: function pipe(parent) {
            var _parent$pipeline,
                _this3 = this;

            for (var _len5 = arguments.length, channels = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                channels[_key5 - 1] = arguments[_key5];
            }

            (_parent$pipeline = parent.pipeline).push.apply(_parent$pipeline, channels);
            if (!parent.cancel) {
                parent.cancel = (function callee$2$0() {
                    var running, val, _puts, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, channel;

                    return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                        while (1) switch (context$3$0.prev = context$3$0.next) {
                            case 0:
                                running = true;

                            case 1:
                                if (!running) {
                                    context$3$0.next = 31;
                                    break;
                                }

                                context$3$0.next = 4;
                                return parent.take();

                            case 4:
                                val = context$3$0.sent;

                                if (!(val === Channel.DONE)) {
                                    context$3$0.next = 7;
                                    break;
                                }

                                return context$3$0.abrupt('break', 31);

                            case 7:
                                _puts = [];
                                _iteratorNormalCompletion5 = true;
                                _didIteratorError5 = false;
                                _iteratorError5 = undefined;
                                context$3$0.prev = 11;

                                for (_iterator5 = parent.pipeline[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    channel = _step5.value;

                                    // side note: we could add awaits here
                                    // the issue with this is that if one buffer gets full,
                                    // it will cause the entire pipe to wait.
                                    // on the other hand,
                                    _puts.push(channel.put(val));

                                    // otherwise, just fire it off like this.
                                    // careful here though as well -- there's no waiting for stacking puts.
                                    // channel.put(val);
                                }
                                context$3$0.next = 19;
                                break;

                            case 15:
                                context$3$0.prev = 15;
                                context$3$0.t0 = context$3$0['catch'](11);
                                _didIteratorError5 = true;
                                _iteratorError5 = context$3$0.t0;

                            case 19:
                                context$3$0.prev = 19;
                                context$3$0.prev = 20;

                                if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                                    _iterator5['return']();
                                }

                            case 22:
                                context$3$0.prev = 22;

                                if (!_didIteratorError5) {
                                    context$3$0.next = 25;
                                    break;
                                }

                                throw _iteratorError5;

                            case 25:
                                return context$3$0.finish(22);

                            case 26:
                                return context$3$0.finish(19);

                            case 27:
                                context$3$0.next = 29;
                                return Promise.all(_puts);

                            case 29:
                                context$3$0.next = 1;
                                break;

                            case 31:
                                return context$3$0.abrupt('return', function () {
                                    running = false;
                                });

                            case 32:
                            case 'end':
                                return context$3$0.stop();
                        }
                    }, null, _this3, [[11, 15, 19, 27], [20,, 22, 26]]);
                })();
            }
            return channels[channels.length - 1];
        }
    }, {
        key: 'merge',

        /*
            Pipes all provided channels into a new, single destination.
        */
        value: function merge() {
            for (var _len6 = arguments.length, channels = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                channels[_key6] = arguments[_key6];
            }

            var child = new Channel();
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = channels[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _parent = _step6.value;

                    _parent.pipe(child);
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                        _iterator6['return']();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return child;
        }
    }, {
        key: 'unpipe',

        // UNTESTED. CARE.
        value: function unpipe(parent) {
            for (var _len7 = arguments.length, channels = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                channels[_key7 - 1] = arguments[_key7];
            }

            log('unpipe!');
            log(parent);
            log(channels);
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = Array.entries(parent.pipeline)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _step7$value = _slicedToArray(_step7.value, 2);

                    var index = _step7$value[0];
                    var pipe = _step7$value[1];
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = channels[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var ch2 = _step8.value;

                            if (pipe === ch2) {
                                // optimize later
                                parent.pipeline.splice(index); // is this safe? multiple splices while iterating? seems scurry..
                            }
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                                _iterator8['return']();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                        _iterator7['return']();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            if (parent.pipeline.length === 0 && parent.cancel) parent.cancel(); // don't spin the piping methods when no pipeline is attached?
        }
    }]);

    return Channel;
})();

exports['default'] = Channel;

Channel.DEFAULT_SIZE = 8;
Channel.DONE = ACTIONS.DONE; // expose this so loops can listen for it

// A queue containing any puts which could not be placed directly onto the buffer

// A queue containing any takes waiting for values to be provided

// A queue containing values ready to be taken.

// An optional function to used to transform values passing through the channel.

// An optional pipeline of channels, to be used to pipe values
// from one channel to multiple others.

// An optional array of promises, to be resolved when the channel is marked as finished.

// HACK WARNING (!!!)
// introduce asynchronous processing when function is synchronous
// to prevent users from shooting themselves in the foot by causing
// unbreakable infinite loops with non async producers.