"use strict";
// require('babel-core/polyfill'); // for regeneratorRuntime

import * as babel from 'babel-core/polyfill'; // no other action necessary, automatically polyfills on import

/* eslint no-unused-vars:0 */   // comprehensions
/* eslint no-loop-func:0 */     // comprehensions
/* eslint no-undef:0 */         // comprehensions
/* eslint comma-spacing:0 */    // me being lazy

//// here is the DI way of doing things.
//// nicely decoupled, but creates some weird dependencies
//// with items like Iterable and Assertion

// import Assert         from './assert.js';
// import Check          from './check.js';
// import Convert        from './convert.js';
// import Util           from './util.js';
// import Logger         from './logger.js';
// import Functions      from './functions.js';
// import StopwatchStack from './stopwatch.js';
// import Iterable       from './iterables.js';
// import {MultiIterable} from './iterables.js';
// import {Assertion} from './assert.js';
// let util      = new Util();
// let check     = new Check({ util });
// let assert    = new Assert({ check, util });
// // let expect = Assertion.expect;
// let expect    = assert.expect.bind(assert);
// let convert   = new Convert({ check, util });
// let logger    = new Logger();
// // deprecate objects
// let log       = logger.log.bind(logger);
// let functions = new Functions();
// let sw        = new StopwatchStack();
// // let iterables = new Iterables({ check, util });

// consider dumping dependency injection,
// so we can use things like Util and Check
// without needing to inject them into
// every instance of Assertion or Iterable

// here is the non DI way
// note that libraries are now tightly coupled with each other,
// but items like Iterable and Assertion can use methods
// on check and util without needing to have the dependencies injected
// every single time a new instance is created.
import assert    from './assert.js';
import check     from './check.js';
import convert   from './convert.js';
import functions from './functions.js';
import iterables from './iterables.js';
import logger    from './logger.js';
import sw        from './stopwatch.js';
import util      from './util.js';

let log = logger.log.bind(logger);
let expect = assert.expect.bind(assert);
let from = iterables.from.bind(iterables);


sw.push('stuff');

function f(a, b, c) {
    return a + b + c;
}
let f1 = functions.curry(f, 1);
let f2 = functions.curry(f1, 2);
let f3 = functions.curry(f2, 3);
let f4 = functions.curry(f3, 4);
log(f1);
log(f2);
log(f3);
log(f4);

log(check.isString(''));
log(check.isString(1));
// assert.isString('');
log(convert.toNumber("123.45"));
logger.warn('this should not appear');
logger.level = 7;
logger.warn('this should');

let arr = null;
let iter = null;
let gen = null;
let val = null;
let fgen = null;
let joined = null;
let set = null;

let currentId = 0;
class Person {
    constructor({ first, last }) {
        this.id = ++currentId;
        this.first = first;
        this.last = last;
    }
    get name() {
        return `${this.first} ${this.last}`;
    }
}

arr = [
      new Person({ first: 'Bob', last: 'Bobbins' })
    , new Person({ first: 'Count', last: 'Dracula' })
    , new Person({ first: 'Mister', last: 'America' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'Amurica' })
    , new Person({ first: 'Mister', last: 'America' })
    , new Person({ first: 'Captain', last: 'Amurica' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'Amurica' })
    , new Person({ first: 'Rand', last: 'Al\'Thor' })
    , new Person({ first: 'Harry', last: 'Potter' })
    , new Person({ first: 'Captain', last: 'America' })
];

set = new Set(arr);

gen = function*() {
    for (let v of arr)
        yield v;
};

function outputs(iterable) {
    // for (let v of iterable)
    //     log(v);
    // log(iterable.toArray());
    // log([...iterable]);
    // log(Array.from(iterable));
}

iter = from(arr);
outputs(iter);

iter = from(arr)
    .orderBy(x => x.last)
    .thenBy(x => x.first)
    .thenBy(x => x.last)
    .where(x => x.first[0].toUpperCase() === 'C');
outputs(iter);

log(iter.at(2));

iter = from(arr);
val = iter.aggregate((x, y) => x + y.id, 0);
log(val);

log(iter.any());
log(iter.any(x => x.id > 200));
log(iter.length());

iter = from([7, 8, 9]).concat([1, 2, 3], [4, 5, 6]);
outputs(iter);

iter = from([7, 8, 9]).concat(from([1, 2, 3]));
outputs(iter);

iter = from([7, 8, 9]);
iter = iter.concat(iter, iter).where(x => x > 7);
outputs(iter);

iter = from(gen);
outputs(iter);

iter = from(gen());
outputs(iter);

iter = from(arr);
outputs(iter);

iter = from(set);
outputs(iter);

iter = from([1, 2]);
iter = iter.join([3, 4], [5, 6]);
outputs(iter);

iter = from([1,5,7,4,2,4,5,7,9,0,2,1])
    .orderBy(x => x)
    .where(x => x > 3)
    .select(x => ({x}))
    .orderBy(x => -x.x)
    ;
outputs(iter);

sw.push('the big one');
for (let i = 0; i < 100; i++) {
    iter = from([1,2,3], [4,5,6], [7,8,9])
        .where(([x,y,z]) => x === 2)
        .orderBy(([x,y,z]) => -y)
        .thenBy(([x,y,z]) => -z)
        .select(([x,y,z]) => ({x, y, z}))
        .orderBy(o => o.y)
        .join([10,11,12])
        .select(([x,a]) => {
            x.a = a;
            return x;
        });
    arr = Array.from(iter);
}
log(sw.pop());


iter = from([1,2,3], [4,5,6], [7,8,9]).where(([x, y, z]) => x === 2);
outputs(iter);

iter = from([1, 2, 3]);
iter = iter
    .join(iter, iter) // make sure we can self join
    .where(([x, y, z]) => x + y + z > 6)
    ;
outputs(iter);

var obj = {};
var debounced = functions.debounce(function() {
    log('debounced context check:', this === obj);
}, 500);
debounced.call(obj);

log(check.empty([]));
expect('').to.be.empty();
expect([]).to.be.empty();
expect(1).to.not.equal(2);
expect(() => 1).to.not.equal(2);

class TestError extends Error {}

expect(() => { throw new TestError('blah'); }).to.throw();
assert.throws(() => { throw new TestError('blah'); });

// assert.is(3, 3);
assert.false(false);
assert.true(true);
assert.isArray([]);
assert.exists(0);
assert.exists('0');
assert.exists([]);
assert.throws(() => assert.exists(null));
assert.throws(() => assert.exists(undefined));
assert.empty(0);
assert.empty(false);
assert.empty(null);
assert.empty(undefined);
assert.empty();
assert.empty('');
assert.empty([]);
assert.empty({});

log('equals..');
log(util.equals(1, 2));
log(util.equals(3, 3));
log(util.equals(null, undefined));

log(util.getType(function*(){}()));
log(util.getType(function*(){}));

let obj1 = {a: 1};
let obj2 = {b: 2};
let obj3 = {a: 1};
log(util.equals(obj1, obj2));
log(util.equals(obj1, obj3));
log(util.equals(obj2, obj3));

// assert.true(() => util.equals({a: 1}, {a: 1}));
// assert.empty(new Set());
// assert.empty(new Map()); // yay? nay?

log(sw.pop());

// let zana       = util; // make util the base?
// zana.assert    = assert;
// zana.check     = check;
// zana.convert   = convert;
// zana.functions = functions;
// zana.log       = logger.log.bind(logger);
// zana.logger    = logger;
// zana.sw        = sw;
// zana.from      = Iterable.from; // best use?
// zana.Iterable  = Iterable;



// let zana = {
//       util      : util
//     , check     : check
//     , assert    : assert
//     , convert   : convert
//     , logger    : logger
//     , log       : logger.log.bind(logger) // for ease of use
//     , sw        : sw
//     , functions : functions
// };

export { util }      from './util.js';
export { check }     from './check.js';
export { logger }    from './logger.js';
export { assert }    from './assert.js';
export { convert }   from './convert.js';
export { functions } from './functions.js';
export { iterables } from './iterables.js';
export { sw }        from './stopwatch.js';
