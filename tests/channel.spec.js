import Channel, { STATES } from '../src/channel.js';
import {Queue, FixedQueue} from '../src/data-structures.js';
import Util from '../src/util.js';
import Check from '../src/check.js';
import Assert from '../src/assert.js';

let util = new Util();
let check = new Check({util});
let assert = new Assert({check, util});
let log = console.log.bind(console);

async function run(callback, done) {
    try {
        await callback();
        return done();
    }
    catch(e) {
        return done(e);
    }
}

async function initialize(done) {
    run(() => {
        let ch = new Channel();
        
        assert.true(ch.empty());

        assert.exists(ch.puts);
        assert.is(ch.puts, Queue);
        assert.true(ch.puts.empty());

        assert.exists(ch.takes);
        assert.is(ch.takes, Queue);
        assert.true(ch.takes.empty());

        assert.exists(ch.buf);
        assert.is(ch.buf, FixedQueue);
        assert.true(ch.buf.empty());
        assert.equal(ch.buf.size, Channel.DEFAULT_SIZE);

        assert.exists(ch.pipeline);
        assert.empty(ch.pipeline);
        assert.is(ch.pipeline, Array.prototype); // need to use prototype with is and standard objects, since Array is of type Function

        assert.exists(ch.waiting);
        assert.empty(ch.waiting);
        assert.is(ch.waiting, Array.prototype);

    }, done);
}

describe('Channel', () => {
    it('should initialize properly', initialize);
});