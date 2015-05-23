"use strict";
require('babel-core/polyfill'); // for regeneratorRuntime

/* eslint no-unused-vars:0 */   // comprehensions
/* eslint no-loop-func:0 */     // comprehensions
/* eslint no-undef:0 */         // comprehensions

// module.exports = z = require("./base.js");
// require("./arrays.js")(z);
// require("./assert.js")(z);
// require("./check.js")(z);
// require("./convert.js")(z);
// require("./events.js")(z);
// require("./functions.js")(z);
// require("./generators.js")(z);
// require("./iterables.js")(z);
// require("./location.js")(z);
// require("./log.js")(z);
// require("./numbers.js")(z);
// require("./objects.js")(z);
// require("./stopwatch.js")(z);

import Assert         from './assert.js';
import Check          from './check.js';
import Convert        from './convert.js';
import Util           from './util.js';
import Logger         from './logger.js';
import Functions      from './functions.js';
import StopwatchStack from './stopwatch.js';
import Iterable       from './iterables.js';

let util      = new Util();
let check     = new Check({ util });
let assert    = new Assert({ check });
let convert   = new Convert({ check, util});
let logger    = new Logger({ check });
// deprecate objects
let log       = logger.log.bind(logger);
let functions = new Functions({ check });
let sw        = new StopwatchStack();
// let iterables = new Iterables({ check, util });

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
assert.isString('');
log(convert.toNumber("123.45"));
logger.warn('this should not appear');
logger.level = 7;
logger.warn('this should');

let from = Iterable.from;
let arr = null;
let iter = null;
let gen = null;
let val = null;
let fgen = null;

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

// sw.push('Iterable');
// for (let i = 0; i < 1000; i++) {
//     arr = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
//         .where(x => x > 3)
//         .select(x => x * 2)
//         .toArray();
// }
// log(sw.pop());

// sw.push('Generator');
// for (let i = 0; i < 1000; i++) {
//     gen = (
//         for (x of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
//         if (x > 3)
//         x * 2
//     );
//     arr = [...gen];
// }
// log(sw.pop());

arr = [
      new Person({ first: 'Bob', last: 'Bobbins' })
    , new Person({ first: 'Count', last: 'Dracula' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'Amurica' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'Amurica' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'America' })
    , new Person({ first: 'Captain', last: 'Amurica' })
    , new Person({ first: 'Rand', last: 'Al\'Thor' })
    , new Person({ first: 'Harry', last: 'Potter' })
];

iter = from(arr)
    .orderBy(x => x.last)
    .thenBy(x => x.first)
    .thenBy(x => x.last)
    .where(x => x.first[0].toUpperCase() === 'C');
log(iter.toArray());

iter = from(arr)
    .orderBy(x => x.last)
    .thenBy(x => x.first)
    .thenBy(x => x.last)
    .where(x => x.first[0].toUpperCase() === 'C');
log([...iter]);

log(iter.at(2));

val = iter.aggregate((x, y) => x + y.id, 0);
log(val);

log(iter.any());
log(iter.any(x => x.id > 200));
log(iter.length());

iter = iter.concat(iter, iter).where(x => x.id > 8);
log([...iter]);

iter = from([7, 8, 9]).concat([1, 2, 3], [4, 5, 6]);
log([...iter]);

iter = from([7, 8, 9]).concat(from([1, 2, 3]));
log([...iter]);

iter = from([7, 8, 9]);
iter = iter.concat(iter);
log([...iter]);


log(sw.pop());

let zana       = util; // make util the base?
zana.assert    = assert;
zana.check     = check;
zana.convert   = convert;
zana.functions = functions;
zana.log       = logger.log.bind(logger);
zana.logger    = logger;
zana.sw        = sw;
zana.from      = Iterable.from; // best use?
zana.Iterable  = Iterable;

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

export default zana;
