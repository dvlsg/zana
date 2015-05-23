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

arr = [new Person({ first: 'Bob', last: 'Bobbins' }), new Person({ first: 'Count', last: 'Dracula' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'Amurica' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'Amurica' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'America' }), new Person({ first: 'Captain', last: 'Amurica' }), new Person({ first: 'Rand', last: 'Al\'Thor' }), new Person({ first: 'Harry', last: 'Potter' })];

iter = from(arr).orderBy(function (x) {
    return x.last;
}).thenBy(function (x) {
    return x.first;
}).thenBy(function (x) {
    return x.last;
}).where(function (x) {
    return x.first[0].toUpperCase() === 'C';
});
log(iter.toArray());

iter = from(arr).orderBy(function (x) {
    return x.last;
}).thenBy(function (x) {
    return x.first;
}).thenBy(function (x) {
    return x.last;
}).where(function (x) {
    return x.first[0].toUpperCase() === 'C';
});
log([].concat(_toConsumableArray(iter)));

log(iter.at(2));

val = iter.aggregate(function (x, y) {
    return x + y.id;
}, 0);
log(val);

log(iter.any());
log(iter.any(function (x) {
    return x.id > 200;
}));
log(iter.length());

iter = iter.concat(iter, iter).where(function (x) {
    return x.id > 8;
});
log([].concat(_toConsumableArray(iter)));

iter = from([7, 8, 9]).concat([1, 2, 3], [4, 5, 6]);
log([].concat(_toConsumableArray(iter)));

iter = from([7, 8, 9]).concat(from([1, 2, 3]));
log([].concat(_toConsumableArray(iter)));

iter = from([7, 8, 9]);
iter = iter.concat(iter);
log([].concat(_toConsumableArray(iter)));

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