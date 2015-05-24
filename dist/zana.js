'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// for regeneratorRuntime

/* eslint no-unused-vars:0 */ // comprehensions
/* eslint no-loop-func:0 */ // comprehensions
/* eslint no-undef:0 */ // comprehensions
/* eslint comma-spacing:0 */ // me being lazy

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

var _assertJs = require('./assert.js');

var _assertJs2 = _interopRequireDefault(_assertJs);

var _checkJs = require('./check.js');

var _checkJs2 = _interopRequireDefault(_checkJs);

var _convertJs = require('./convert.js');

var _convertJs2 = _interopRequireDefault(_convertJs);

var _utilJs = require('./util.js');

var _utilJs2 = _interopRequireDefault(_utilJs);

var _loggerJs = require('./logger.js');

var _loggerJs2 = _interopRequireDefault(_loggerJs);

var _functionsJs = require('./functions.js');

var _functionsJs2 = _interopRequireDefault(_functionsJs);

var _stopwatchJs = require('./stopwatch.js');

var _stopwatchJs2 = _interopRequireDefault(_stopwatchJs);

var _iterablesJs = require('./iterables.js');

var _iterablesJs2 = _interopRequireDefault(_iterablesJs);

require('babel-core/polyfill');

var util = new _utilJs2['default']();
var check = new _checkJs2['default']({ util: util });
var assert = new _assertJs2['default']({ check: check });
var convert = new _convertJs2['default']({ check: check, util: util });
var logger = new _loggerJs2['default']({ check: check });
// deprecate objects
var log = logger.log.bind(logger);
var functions = new _functionsJs2['default']({ check: check });
var sw = new _stopwatchJs2['default']();
// let iterables = new Iterables({ check, util });

sw.push('stuff');

function f(a, b, c) {
    return a + b + c;
}
var f1 = functions.curry(f, 1);
var f2 = functions.curry(f1, 2);
var f3 = functions.curry(f2, 3);
var f4 = functions.curry(f3, 4);
log(f1);
log(f2);
log(f3);
log(f4);

log(check.isString(''));
log(check.isString(1));
assert.isString('');
log(convert.toNumber('123.45'));
logger.warn('this should not appear');
logger.level = 7;
logger.warn('this should');

var from = _iterablesJs2['default'].from;
var arr = null;
var iter = null;
var gen = null;
var val = null;
var fgen = null;
var joined = null;
var set = null;

var currentId = 0;

var Person = (function () {
    function Person(_ref) {
        var first = _ref.first;
        var last = _ref.last;

        _classCallCheck(this, Person);

        this.id = ++currentId;
        this.first = first;
        this.last = last;
    }

    _createClass(Person, [{
        key: 'name',
        get: function () {
            return '' + this.first + ' ' + this.last;
        }
    }]);

    return Person;
})();

arr = [new Person({ first: 'Bob', last: 'Bobbins' }), new Person({ first: 'Count', last: 'Dracula' }), new Person({ first: 'Mister', last: 'America' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'Amurica' }), new Person({ first: 'Mister', last: 'America' }), new Person({ first: 'Captain', last: 'Amurica' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'Amurica' }), new Person({ first: 'Rand', last: 'Al\'Thor' }), new Person({ first: 'Harry', last: 'Potter' }), new Person({ first: 'Captain', last: 'America' })];

set = new Set(arr);

gen = regeneratorRuntime.mark(function callee$0$0() {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, v;

    return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$1$0.prev = 3;
                _iterator = arr[Symbol.iterator]();

            case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    context$1$0.next = 12;
                    break;
                }

                v = _step.value;
                context$1$0.next = 9;
                return v;

            case 9:
                _iteratorNormalCompletion = true;
                context$1$0.next = 5;
                break;

            case 12:
                context$1$0.next = 18;
                break;

            case 14:
                context$1$0.prev = 14;
                context$1$0.t0 = context$1$0['catch'](3);
                _didIteratorError = true;
                _iteratorError = context$1$0.t0;

            case 18:
                context$1$0.prev = 18;
                context$1$0.prev = 19;

                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }

            case 21:
                context$1$0.prev = 21;

                if (!_didIteratorError) {
                    context$1$0.next = 24;
                    break;
                }

                throw _iteratorError;

            case 24:
                return context$1$0.finish(21);

            case 25:
                return context$1$0.finish(18);

            case 26:
            case 'end':
                return context$1$0.stop();
        }
    }, callee$0$0, this, [[3, 14, 18, 26], [19,, 21, 25]]);
});

function outputs(iterable) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = iterable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var v = _step2.value;

            log(v);
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

    log(iterable.toArray());
    log([].concat(_toConsumableArray(iterable)));
    log(Array.from(iterable));
}

iter = from(arr);
outputs(iter);

iter = from(arr).orderBy(function (x) {
    return x.last;
}).thenBy(function (x) {
    return x.first;
}).thenBy(function (x) {
    return x.last;
}).where(function (x) {
    return x.first[0].toUpperCase() === 'C';
});
outputs(iter);

log(iter.at(2));

// iter = from(arr);
// val = iter.aggregate((x, y) => x + y.id, 0);
// log(val);

// log(iter.any());
// log(iter.any(x => x.id > 200));
// log(iter.length());

// iter = iter.concat(iter, iter).where(x => x.id > 8);
// log([...iter]);

iter = from([7, 8, 9]).concat([1, 2, 3], [4, 5, 6]);
outputs(iter);

iter = from([7, 8, 9]).concat(from([1, 2, 3]));
outputs(iter);

iter = from([7, 8, 9]);
iter = iter.concat(iter, iter);
outputs(iter);

// iter = from(gen);
// for (let v of iter)
//     log(v);
// log(iter.toArray());
// log([...iter]);
// log(Array.from(iter));

// iter = from(gen());
// for (let v of iter)
//     log(v);
// log(iter.toArray()); // note, this wont work: gen is consumed, when used this way. this is as intended.
// log([...iter]);
// log(Array.from(iter));

// iter = from(arr);
// for (let v of iter)
//     log(v);
// log(iter.toArray());
// log([...iter]);
// log(Array.from(iter));

// iter = from(set);
// for (let v of iter)
//     log(v);
// log(iter.toArray());
// log([...iter]);
// log(Array.from(iter));

// iter = from([1, 2]);
// iter = iter.join([3, 4], [5, 6]);
// for (let v of iter)
//     log(v);
// log([...iter]);

// iter = from([1, 2]);
// iter = iter.join(iter).join(iter);
// log(Array.from(iter));
// iter = iter.where(([x, y, z]) => x === 2);
// log(Array.from(iter));

// iter = from([1,5,7,4,2,4,5,7,9,0,2,1])
//     .orderBy(x => x)
//     .where(x => x > 3)
//     .select(x => ({x}))
//     .orderBy(x => -x.x)
//     ;

// log(...iter);

// sw.push('the big one');
// for (let i = 0; i < 100; i++) {
//     iter = new MultiIterable([1,2,3], [4,5,6], [7,8,9])
//         .where(([x,y,z]) => x === 2)
//         .orderBy(([x,y,z]) => -y)
//         .thenBy(([x,y,z]) => -z)
//         .select(([x,y,z]) => ({x, y, z}))
//         .orderBy(o => o.y)
//         .join([10,11,12])
//         .select(([x,a]) => {
//             x.a = a;
//             return x;
//         });
//     arr = Array.from(iter);
// }
// log(sw.pop());

// iter = MultiIterable.from([1,2,3], [4,5,6], [7,8,9]).where(([x, y, z]) => x === 2);
// log(Array.from(iter));

// iter = from([1, 2, 3]);
// iter = iter
//     .join(iter, iter) // make sure we can self join
//     .where(([x, y, z]) => {
//         log('x:', x);
//         log('y:', y);
//         log('z:', z);
//         return x + y + z > 6;
//     })
//     ;
// for (let v of iter)
//     log(v);
// log(iter.toArray());
// log([...iter]);
// log(Array.from(iter));

log(sw.pop());

var zana = util; // make util the base?
zana.assert = assert;
zana.check = check;
zana.convert = convert;
zana.functions = functions;
zana.log = logger.log.bind(logger);
zana.logger = logger;
zana.sw = sw;
zana.from = _iterablesJs2['default'].from; // best use?
zana.Iterable = _iterablesJs2['default'];

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

exports['default'] = zana;
module.exports = exports['default'];