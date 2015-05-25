'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// require('babel-core/polyfill'); // for regeneratorRuntime

var _babelCorePolyfill = require('babel-core/polyfill');

var babel = _interopRequireWildcard(_babelCorePolyfill);

// no other action necessary, automatically polyfills on import

/* eslint no-unused-vars:0 */ // comprehensions
/* eslint no-loop-func:0 */ // comprehensions
/* eslint no-undef:0 */ // comprehensions
/* eslint comma-spacing:0 */ // me being lazy

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

var _assertJs = require('./assert.js');

var _assertJs2 = _interopRequireDefault(_assertJs);

var _checkJs = require('./check.js');

var _checkJs2 = _interopRequireDefault(_checkJs);

var _convertJs = require('./convert.js');

var _convertJs2 = _interopRequireDefault(_convertJs);

var _functionsJs = require('./functions.js');

var _functionsJs2 = _interopRequireDefault(_functionsJs);

var _iterablesJs = require('./iterables.js');

var _iterablesJs2 = _interopRequireDefault(_iterablesJs);

var _loggerJs = require('./logger.js');

var _loggerJs2 = _interopRequireDefault(_loggerJs);

var _stopwatchJs = require('./stopwatch.js');

var _stopwatchJs2 = _interopRequireDefault(_stopwatchJs);

var _utilJs = require('./util.js');

var _utilJs2 = _interopRequireDefault(_utilJs);

var log = _loggerJs2['default'].log.bind(_loggerJs2['default']);
var expect = _assertJs2['default'].expect.bind(_assertJs2['default']);
var from = _iterablesJs2['default'].from.bind(_iterablesJs2['default']);

_stopwatchJs2['default'].push('stuff');

function f(a, b, c) {
    return a + b + c;
}
var f1 = _functionsJs2['default'].curry(f, 1);
var f2 = _functionsJs2['default'].curry(f1, 2);
var f3 = _functionsJs2['default'].curry(f2, 3);
var f4 = _functionsJs2['default'].curry(f3, 4);
log(f1);
log(f2);
log(f3);
log(f4);

log(_checkJs2['default'].isString(''));
log(_checkJs2['default'].isString(1));
// assert.isString('');
log(_convertJs2['default'].toNumber('123.45'));
_loggerJs2['default'].warn('this should not appear');
_loggerJs2['default'].level = 7;
_loggerJs2['default'].warn('this should');

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

function outputs(iterable) {}

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

iter = from(arr);
val = iter.aggregate(function (x, y) {
    return x + y.id;
}, 0);
log(val);

log(iter.any());
log(iter.any(function (x) {
    return x.id > 200;
}));
log(iter.length());

iter = from([7, 8, 9]).concat([1, 2, 3], [4, 5, 6]);
outputs(iter);

iter = from([7, 8, 9]).concat(from([1, 2, 3]));
outputs(iter);

iter = from([7, 8, 9]);
iter = iter.concat(iter, iter).where(function (x) {
    return x > 7;
});
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

iter = from([1, 5, 7, 4, 2, 4, 5, 7, 9, 0, 2, 1]).orderBy(function (x) {
    return x;
}).where(function (x) {
    return x > 3;
}).select(function (x) {
    return { x: x };
}).orderBy(function (x) {
    return -x.x;
});
outputs(iter);

_stopwatchJs2['default'].push('the big one');
for (var i = 0; i < 100; i++) {
    iter = from([1, 2, 3], [4, 5, 6], [7, 8, 9]).where(function (_ref2) {
        var _ref22 = _slicedToArray(_ref2, 3);

        var x = _ref22[0];
        var y = _ref22[1];
        var z = _ref22[2];
        return x === 2;
    }).orderBy(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 3);

        var x = _ref32[0];
        var y = _ref32[1];
        var z = _ref32[2];
        return -y;
    }).thenBy(function (_ref4) {
        var _ref42 = _slicedToArray(_ref4, 3);

        var x = _ref42[0];
        var y = _ref42[1];
        var z = _ref42[2];
        return -z;
    }).select(function (_ref5) {
        var _ref52 = _slicedToArray(_ref5, 3);

        var x = _ref52[0];
        var y = _ref52[1];
        var z = _ref52[2];
        return { x: x, y: y, z: z };
    }).orderBy(function (o) {
        return o.y;
    }).join([10, 11, 12]).select(function (_ref6) {
        var _ref62 = _slicedToArray(_ref6, 2);

        var x = _ref62[0];
        var a = _ref62[1];

        x.a = a;
        return x;
    });
    arr = Array.from(iter);
}
log(_stopwatchJs2['default'].pop());

iter = from([1, 2, 3], [4, 5, 6], [7, 8, 9]).where(function (_ref7) {
    var _ref72 = _slicedToArray(_ref7, 3);

    var x = _ref72[0];
    var y = _ref72[1];
    var z = _ref72[2];
    return x === 2;
});
outputs(iter);

iter = from([1, 2, 3]);
iter = iter.join(iter, iter) // make sure we can self join
.where(function (_ref8) {
    var _ref82 = _slicedToArray(_ref8, 3);

    var x = _ref82[0];
    var y = _ref82[1];
    var z = _ref82[2];
    return x + y + z > 6;
});
outputs(iter);

var obj = {};
var debounced = _functionsJs2['default'].debounce(function () {
    log('debounced context check:', this === obj);
}, 500);
debounced.call(obj);

log(_checkJs2['default'].empty([]));
expect('').to.be.empty();
expect([]).to.be.empty();
expect(1).to.not.equal(2);
expect(function () {
    return 1;
}).to.not.equal(2);

var TestError = (function (_Error) {
    function TestError() {
        _classCallCheck(this, TestError);

        if (_Error != null) {
            _Error.apply(this, arguments);
        }
    }

    _inherits(TestError, _Error);

    return TestError;
})(Error);

expect(function () {
    throw new TestError('blah');
}).to['throw']();
_assertJs2['default'].throws(function () {
    throw new TestError('blah');
});

// assert.is(3, 3);
_assertJs2['default']['false'](false);
_assertJs2['default']['true'](true);
_assertJs2['default'].isArray([]);
_assertJs2['default'].exists(0);
_assertJs2['default'].exists('0');
_assertJs2['default'].exists([]);
_assertJs2['default'].throws(function () {
    return _assertJs2['default'].exists(null);
});
_assertJs2['default'].throws(function () {
    return _assertJs2['default'].exists(undefined);
});
_assertJs2['default'].empty(0);
_assertJs2['default'].empty(false);
_assertJs2['default'].empty(null);
_assertJs2['default'].empty(undefined);
_assertJs2['default'].empty();
_assertJs2['default'].empty('');
_assertJs2['default'].empty([]);
_assertJs2['default'].empty({});

log('equals..');
log(_utilJs2['default'].equals(1, 2));
log(_utilJs2['default'].equals(3, 3));
log(_utilJs2['default'].equals(null, undefined));

log(_utilJs2['default'].getType(regeneratorRuntime.mark(function callee$0$0() {
    return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
            case 'end':
                return context$1$0.stop();
        }
    }, callee$0$0, this);
})()));
log(_utilJs2['default'].getType(regeneratorRuntime.mark(function callee$0$0() {
    return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
            case 'end':
                return context$1$0.stop();
        }
    }, callee$0$0, this);
})));

var obj1 = { a: 1 };
var obj2 = { b: 2 };
var obj3 = { a: 1 };
log(_utilJs2['default'].equals(obj1, obj2));
log(_utilJs2['default'].equals(obj1, obj3));
log(_utilJs2['default'].equals(obj2, obj3));

// assert.true(() => util.equals({a: 1}, {a: 1}));
// assert.empty(new Set());
// assert.empty(new Map()); // yay? nay?

log(_stopwatchJs2['default'].pop());

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

Object.defineProperty(exports, 'util', {
    enumerable: true,
    get: function get() {
        return _utilJs.util;
    }
});
Object.defineProperty(exports, 'check', {
    enumerable: true,
    get: function get() {
        return _checkJs.check;
    }
});
Object.defineProperty(exports, 'logger', {
    enumerable: true,
    get: function get() {
        return _loggerJs.logger;
    }
});
Object.defineProperty(exports, 'assert', {
    enumerable: true,
    get: function get() {
        return _assertJs.assert;
    }
});
Object.defineProperty(exports, 'convert', {
    enumerable: true,
    get: function get() {
        return _convertJs.convert;
    }
});
Object.defineProperty(exports, 'functions', {
    enumerable: true,
    get: function get() {
        return _functionsJs.functions;
    }
});
Object.defineProperty(exports, 'iterables', {
    enumerable: true,
    get: function get() {
        return _iterablesJs.iterables;
    }
});
Object.defineProperty(exports, 'sw', {
    enumerable: true,
    get: function get() {
        return _stopwatchJs.sw;
    }
});

// for (let v of iterable)
//     log(v);
// log(iterable.toArray());
// log([...iterable]);
// log(Array.from(iterable));