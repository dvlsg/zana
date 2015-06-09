/* eslint no-unused-vars: 0 */
/* eslint no-trailing-spaces: 0 */
/* eslint no-use-before-define: 0 */

/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x14, _x15, _x16) { var _again = true; _function: while (_again) { var object = _x14, property = _x15, receiver = _x16; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x14 = parent; _x15 = property; _x16 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var slice = Array.prototype.slice;
var die = process.exit.bind(process);

var log = function log() {
    var args = slice.call(arguments);
    console.log.apply(console, args);
};

function buildMapArray(count) {
    var mapArray = new Array(count);
    for (var i = 0; i < count; i++) {
        mapArray[i] = i;
    }return mapArray;
}

function buildKeyArray(elements, selector, count) {
    var keyArray = new Array(count);
    for (var i = 0; i < count; i++) {
        keyArray[i] = selector(elements[i]);
    }return keyArray;
}

function quicksort3(keyArray, mapArray, comparer, left, right) {
    var indexForLessThan = left;
    var indexForGreaterThan = right;
    var pivotIndex = mapArray[left];
    var indexForIterator = left + 1;
    while (indexForIterator <= indexForGreaterThan) {
        var cmp = comparer(keyArray[mapArray[indexForIterator]], keyArray[pivotIndex], mapArray[indexForIterator], mapArray[pivotIndex]);
        if (cmp < 0) swap(mapArray, indexForLessThan++, indexForIterator++);else if (cmp > 0) swap(mapArray, indexForIterator, indexForGreaterThan--);else indexForIterator++;
    }
    if (left < indexForLessThan - 1) quicksort3(keyArray, mapArray, comparer, left, indexForLessThan - 1);
    if (indexForGreaterThan + 1 < right) quicksort3(keyArray, mapArray, comparer, indexForGreaterThan + 1, right);
}

function compareKeys(comparer, keys, i1, i2) {
    var k1 = keys[i1];
    var k2 = keys[i2];
    var c = comparer(k1, k2);
    if (c === 0) return i1 - i2;
    return c;
}

function swap(arr, a, b) {
    var _ref = [arr[b], arr[a]];
    arr[a] = _ref[0];
    arr[b] = _ref[1];
}

function quicksort(keys, map, comparer, left, right) {
    do {
        var i = left;
        var j = right;
        var x = map[i + (j - i >> 1)];
        var p = keys[x];
        do {
            while (i < map.length && compareKeys(comparer, keys, x, map[i]) > 0) i++;
            while (j >= 0 && compareKeys(comparer, keys, x, map[j]) < 0) j--;
            if (i > j) break; // left index has crossed right index, stop the loop
            if (i < j) {
                var _ref2 = [map[j], map[i]];
                map[i] = _ref2[0];
                map[j] = _ref2[1];
            } // does this work?
            // swap(map, i, j); // swap the indexes in the map
            i++;
            j--;
        } while (i <= j);
        if (j - left <= right - i) {
            if (left < j) quicksort(keys, map, comparer, left, j);
            left = i;
        } else {
            if (i < right) quicksort(keys, map, comparer, i, right);
            right = j;
        }
    } while (left < right);
}

var Iterable = (function () {
    function Iterable(data) {
        _classCallCheck(this, Iterable);

        this.__initializeProperties();

        this.data = data;
    }

    _createClass(Iterable, [{
        key: Symbol.toStringTag,
        value: function () {
            return 'Iterable';
        }
    }, {
        key: Symbol.iterator,
        value: function () {
            return Iterable.expand(this.data)[Symbol.iterator](); // covers arrays, sets, generator functions, generators..
        }
    }, {
        key: 'aggregate',
        value: function aggregate() {
            var func = arguments[0] === undefined ? function (x) {
                return x;
            } : arguments[0];
            var seed = arguments[1] === undefined ? null : arguments[1];

            var iter = this[Symbol.iterator]();
            var result = null;
            if (seed === null) result = iter.next().value; // what about empty iterables?
            else result = func(seed, iter.next().value);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = iter[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    result = func(result, v);
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

            return result;
        }
    }, {
        key: 'at',
        value: function at(index) {
            if (Array.isArray(this.data)) return this.data[index];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var v = _step2.value;

                    if (index-- === 0) return v;
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
        }
    }, {
        key: 'any',
        value: function any() {
            var predicate = arguments[0] === undefined ? null : arguments[0];

            if (predicate && typeof predicate === 'function') {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var v = _step3.value;

                        if (predicate(v)) return true;
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
            } else {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var v = _step4.value;

                        if (v != null) return true;
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
            }
            return false;
        }
    }, {
        key: 'concat',
        value: function concat() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var iters = [Iterable.expand(this.data)];
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = args[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var arg = _step5.value;

                    if (arg instanceof Iterable) // a bit hacky... but functional. need to make sure we can use iter.concat(iter)
                        iters.push(Iterable.expand(arg.data));else iters.push(arg);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                        _iterator5['return']();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.data = regeneratorRuntime.mark(function callee$2$0() {
                var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, iter, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, v;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            _iteratorNormalCompletion6 = true;
                            _didIteratorError6 = false;
                            _iteratorError6 = undefined;
                            context$3$0.prev = 3;
                            _iterator6 = iters[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                                context$3$0.next = 36;
                                break;
                            }

                            iter = _step6.value;
                            _iteratorNormalCompletion7 = true;
                            _didIteratorError7 = false;
                            _iteratorError7 = undefined;
                            context$3$0.prev = 10;
                            _iterator7 = iter[Symbol.iterator]();

                        case 12:
                            if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                                context$3$0.next = 19;
                                break;
                            }

                            v = _step7.value;
                            context$3$0.next = 16;
                            return v;

                        case 16:
                            _iteratorNormalCompletion7 = true;
                            context$3$0.next = 12;
                            break;

                        case 19:
                            context$3$0.next = 25;
                            break;

                        case 21:
                            context$3$0.prev = 21;
                            context$3$0.t0 = context$3$0['catch'](10);
                            _didIteratorError7 = true;
                            _iteratorError7 = context$3$0.t0;

                        case 25:
                            context$3$0.prev = 25;
                            context$3$0.prev = 26;

                            if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                                _iterator7['return']();
                            }

                        case 28:
                            context$3$0.prev = 28;

                            if (!_didIteratorError7) {
                                context$3$0.next = 31;
                                break;
                            }

                            throw _iteratorError7;

                        case 31:
                            return context$3$0.finish(28);

                        case 32:
                            return context$3$0.finish(25);

                        case 33:
                            _iteratorNormalCompletion6 = true;
                            context$3$0.next = 5;
                            break;

                        case 36:
                            context$3$0.next = 42;
                            break;

                        case 38:
                            context$3$0.prev = 38;
                            context$3$0.t1 = context$3$0['catch'](3);
                            _didIteratorError6 = true;
                            _iteratorError6 = context$3$0.t1;

                        case 42:
                            context$3$0.prev = 42;
                            context$3$0.prev = 43;

                            if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                                _iterator6['return']();
                            }

                        case 45:
                            context$3$0.prev = 45;

                            if (!_didIteratorError6) {
                                context$3$0.next = 48;
                                break;
                            }

                            throw _iteratorError6;

                        case 48:
                            return context$3$0.finish(45);

                        case 49:
                            return context$3$0.finish(42);

                        case 50:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, callee$2$0, this, [[3, 38, 42, 50], [10, 21, 25, 33], [26,, 28, 32], [43,, 45, 49]]);
            });
            return this;
        }
    }, {
        key: 'join',
        value: function join() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return new (_bind.apply(MultiIterable, [null].concat([this], args)))();
        }
    }, {
        key: 'length',
        value: function length() {
            // shortcut if we have array / set / map / etc
            if (this.data.length) return this.data.length;
            var len = 0;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var v = _step8.value;

                    len++;
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

            return len;
        }
    }, {
        key: 'orderBy',
        value: function orderBy() {
            var selector = arguments[0] === undefined ? function (x) {
                return x;
            } : arguments[0];
            var comparer = arguments[1] === undefined ? function (x, y) {
                return x > y ? 1 : x < y ? -1 : 0;
            } : arguments[1];
            var descending = arguments[2] === undefined ? false : arguments[2];

            return new OrderedIterable(this, selector, comparer, descending);
        }
    }, {
        key: 'orderByDescending',
        value: function orderByDescending() {
            var selector = arguments[0] === undefined ? function (x) {
                return x;
            } : arguments[0];
            var comparer = arguments[1] === undefined ? function (x, y) {
                return x > y ? 1 : x < y ? -1 : 0;
            } : arguments[1];

            return new OrderedIterable(this, selector, comparer, true);
        }
    }, {
        key: 'select',
        value: function select() {
            var selector = arguments[0] === undefined ? function (x) {
                return x;
            } : arguments[0];

            var data = this.data; // expand needs to be internal in this case.
            this.data = regeneratorRuntime.mark(function callee$2$0() {
                var _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, v;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            _iteratorNormalCompletion9 = true;
                            _didIteratorError9 = false;
                            _iteratorError9 = undefined;
                            context$3$0.prev = 3;
                            _iterator9 = Iterable.expand(data)[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                                context$3$0.next = 12;
                                break;
                            }

                            v = _step9.value;
                            context$3$0.next = 9;
                            return selector(v);

                        case 9:
                            _iteratorNormalCompletion9 = true;
                            context$3$0.next = 5;
                            break;

                        case 12:
                            context$3$0.next = 18;
                            break;

                        case 14:
                            context$3$0.prev = 14;
                            context$3$0.t0 = context$3$0['catch'](3);
                            _didIteratorError9 = true;
                            _iteratorError9 = context$3$0.t0;

                        case 18:
                            context$3$0.prev = 18;
                            context$3$0.prev = 19;

                            if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                                _iterator9['return']();
                            }

                        case 21:
                            context$3$0.prev = 21;

                            if (!_didIteratorError9) {
                                context$3$0.next = 24;
                                break;
                            }

                            throw _iteratorError9;

                        case 24:
                            return context$3$0.finish(21);

                        case 25:
                            return context$3$0.finish(18);

                        case 26:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, callee$2$0, this, [[3, 14, 18, 26], [19,, 21, 25]]);
            });
            return this;
        }
    }, {
        key: 'toArray',
        value: function toArray() {
            //// option 1
            // return Array.from(this);

            //// option 2
            // if (Array.isArray(this.data))
            //     return this.data;
            // return [...this];

            //// option 3
            var arr = [];
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var v = _step10.value;

                    arr.push(v);
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                        _iterator10['return']();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            return arr;
        }
    }, {
        key: 'where',
        value: function where() {
            var predicate = arguments[0] === undefined ? function (x) {
                return x;
            } : arguments[0];

            var data = this.data;
            this.data = regeneratorRuntime.mark(function callee$2$0() {
                var _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, v;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            _iteratorNormalCompletion11 = true;
                            _didIteratorError11 = false;
                            _iteratorError11 = undefined;
                            context$3$0.prev = 3;
                            _iterator11 = Iterable.expand(data)[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                                context$3$0.next = 13;
                                break;
                            }

                            v = _step11.value;

                            if (!predicate(v)) {
                                context$3$0.next = 10;
                                break;
                            }

                            context$3$0.next = 10;
                            return v;

                        case 10:
                            _iteratorNormalCompletion11 = true;
                            context$3$0.next = 5;
                            break;

                        case 13:
                            context$3$0.next = 19;
                            break;

                        case 15:
                            context$3$0.prev = 15;
                            context$3$0.t0 = context$3$0['catch'](3);
                            _didIteratorError11 = true;
                            _iteratorError11 = context$3$0.t0;

                        case 19:
                            context$3$0.prev = 19;
                            context$3$0.prev = 20;

                            if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                                _iterator11['return']();
                            }

                        case 22:
                            context$3$0.prev = 22;

                            if (!_didIteratorError11) {
                                context$3$0.next = 25;
                                break;
                            }

                            throw _iteratorError11;

                        case 25:
                            return context$3$0.finish(22);

                        case 26:
                            return context$3$0.finish(19);

                        case 27:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, callee$2$0, this, [[3, 15, 19, 27], [20,, 22, 26]]);
            });
            return this;
        }
    }, {
        key: '__initializeProperties',
        value: function __initializeProperties() {
            this.contains = function (item) {
                var selector = arguments[1] === undefined ? function (x) {
                    return x;
                } : arguments[1];

                var comparer = undefined;
                // if we get rid of this, we can get rid of dependencies
                if (item instanceof Function) comparer = function (x) {
                    return item(x);
                };else comparer = function (x, y) {
                    return x === y;
                };
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                    for (var _iterator12 = this[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                        var v = _step12.value;

                        if (comparer(selector(v), item)) return true;
                    }
                } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                            _iterator12['return']();
                        }
                    } finally {
                        if (_didIteratorError12) {
                            throw _iteratorError12;
                        }
                    }
                }

                return false;
            };
        }
    }], [{
        key: 'from',
        value: function from(data) {
            return new Iterable(data);
        }
    }, {
        key: 'empty',
        value: function empty() {
            return new Iterable([]);
        }
    }, {
        key: 'expand',
        value: function expand(iter) {
            if (iter && typeof iter === 'function') // really need typeof generatorFunction..
                return iter();
            // if (iter && iter[Symbol.iterator] && typeof iter[Symbol.iterator] === 'function')
            //     return iter[Symbol.iterator]();
            return iter;
        }
    }]);

    return Iterable;
})();

exports.Iterable = Iterable;

var MultiIterable = (function (_Iterable) {
    // does extending even make sense? sort of cheating...

    function MultiIterable() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        _classCallCheck(this, MultiIterable);

        _get(Object.getPrototypeOf(MultiIterable.prototype), 'constructor', this).call(this); // cheating.. sort of..
        this.iterables = [];
        this.join.apply(this, args);
    }

    _inherits(MultiIterable, _Iterable);

    _createClass(MultiIterable, [{
        key: Symbol.toStringTag,
        value: function () {
            return 'MultiIterable';
        }
    }, {
        key: 'join',

        /*
            need to be able to chain .join calls
            as a result, we need to keep a running list of iterables which have been joined,
            but only access them whenever this.data is used (iteration over Iterable)
              examples:
              new Iterable([1,2,3])
                .join([4,5,6])
                .join([7,8,9]);
              OR new Iterable([1,2,3])
                .join([4,5,6], [7,8,9]);
              OR new MultiIterable([1,2,3], [4,5,6], [7,8,9])
              the desired yields are:
                [1,4,7]
                [1,4,8]
                [1,4,9]
                [1,5,7]
                [1,5,8]
                [1,5,9]
                ...
                [3,6,7]
                [3,6,8]
                [3,6,9]
        */
        value: function join() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = args[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var v = _step13.value;

                    this.iterables.push(v);
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                        _iterator13['return']();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }

            // keep a running list of iterables, only use them when this.data is iterated over
            var self = this;
            this.data = regeneratorRuntime.mark(function callee$2$0() {
                var marked3$0, expanded, _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, iter, iterate;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            iterate = function iterate(index, accumulate) {
                                var _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, v;

                                return regeneratorRuntime.wrap(function iterate$(context$4$0) {
                                    while (1) switch (context$4$0.prev = context$4$0.next) {
                                        case 0:
                                            if (!(accumulate.length < expanded.length)) {
                                                context$4$0.next = 29;
                                                break;
                                            }

                                            _iteratorNormalCompletion15 = true;
                                            _didIteratorError15 = false;
                                            _iteratorError15 = undefined;
                                            context$4$0.prev = 4;
                                            _iterator15 = expanded[index][Symbol.iterator]();

                                        case 6:
                                            if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
                                                context$4$0.next = 13;
                                                break;
                                            }

                                            v = _step15.value;

                                            accumulate.push(v);
                                            return context$4$0.delegateYield(iterate(index + 1, accumulate), 't0', 10);

                                        case 10:
                                            _iteratorNormalCompletion15 = true;
                                            context$4$0.next = 6;
                                            break;

                                        case 13:
                                            context$4$0.next = 19;
                                            break;

                                        case 15:
                                            context$4$0.prev = 15;
                                            context$4$0.t1 = context$4$0['catch'](4);
                                            _didIteratorError15 = true;
                                            _iteratorError15 = context$4$0.t1;

                                        case 19:
                                            context$4$0.prev = 19;
                                            context$4$0.prev = 20;

                                            if (!_iteratorNormalCompletion15 && _iterator15['return']) {
                                                _iterator15['return']();
                                            }

                                        case 22:
                                            context$4$0.prev = 22;

                                            if (!_didIteratorError15) {
                                                context$4$0.next = 25;
                                                break;
                                            }

                                            throw _iteratorError15;

                                        case 25:
                                            return context$4$0.finish(22);

                                        case 26:
                                            return context$4$0.finish(19);

                                        case 27:
                                            context$4$0.next = 31;
                                            break;

                                        case 29:
                                            context$4$0.next = 31;
                                            return Array.from(accumulate);

                                        case 31:
                                            // make a copy
                                            accumulate.pop(); // base and recursive case both need to pop

                                        case 32:
                                        case 'end':
                                            return context$4$0.stop();
                                    }
                                }, marked3$0[0], this, [[4, 15, 19, 27], [20,, 22, 26]]);
                            };

                            marked3$0 = [iterate].map(regeneratorRuntime.mark);
                            expanded = [];
                            _iteratorNormalCompletion14 = true;
                            _didIteratorError14 = false;
                            _iteratorError14 = undefined;
                            context$3$0.prev = 6;

                            for (_iterator14 = self.iterables[Symbol.iterator](); !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                                iter = _step14.value;

                                expanded.push(Array.from(Iterable.expand(iter)));
                            }context$3$0.next = 14;
                            break;

                        case 10:
                            context$3$0.prev = 10;
                            context$3$0.t0 = context$3$0['catch'](6);
                            _didIteratorError14 = true;
                            _iteratorError14 = context$3$0.t0;

                        case 14:
                            context$3$0.prev = 14;
                            context$3$0.prev = 15;

                            if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                                _iterator14['return']();
                            }

                        case 17:
                            context$3$0.prev = 17;

                            if (!_didIteratorError14) {
                                context$3$0.next = 20;
                                break;
                            }

                            throw _iteratorError14;

                        case 20:
                            return context$3$0.finish(17);

                        case 21:
                            return context$3$0.finish(14);

                        case 22:
                            return context$3$0.delegateYield(iterate(0, []), 't1', 23);

                        case 23:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, callee$2$0, this, [[6, 10, 14, 22], [15,, 17, 21]]);
            });
            return this;
        }
    }], [{
        key: 'from',
        value: function from() {
            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            return new (_bind.apply(MultiIterable, [null].concat(args)))();
        }
    }]);

    return MultiIterable;
})(Iterable);

exports.MultiIterable = MultiIterable;

var OrderedIterable = (function (_Iterable2) {
    function OrderedIterable(data, selector, comparer, descending) {
        _classCallCheck(this, OrderedIterable);

        _get(Object.getPrototypeOf(OrderedIterable.prototype), 'constructor', this).call(this);
        // log('OrderedIterable constructor');
        this.selector = selector;
        this.comparer = comparer;
        this.toSort = data; // keep a separate pointer to the data to be sorted, we need to change this.data on each orderBy/thenBy call
        this.update();
    }

    _inherits(OrderedIterable, _Iterable2);

    _createClass(OrderedIterable, [{
        key: Symbol.toStringTag,
        value: function () {
            return 'OrderedIterable';
        }
    }, {
        key: 'update',

        // find a better name for this (and possibly a better spot. static?)
        // it is being re-used by constructor, and thenBy, so it should be a function somewhere
        value: function update() {
            var self = this;
            this.data = regeneratorRuntime.mark(function callee$2$0() {
                var elements, unsortedElements, unsortedCount, sortableElements, sortedCount, sortedKeys, sortedMap, i, _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, v;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            elements = [].concat(_toConsumableArray(Iterable.expand(self.toSort)));
                            unsortedElements = elements.filter(function (x) {
                                return self.selector(x) == null;
                            });
                            unsortedCount = unsortedElements.length;
                            sortableElements = elements.filter(function (x) {
                                return self.selector(x) != null;
                            });
                            sortedCount = sortableElements.length;
                            sortedKeys = buildKeyArray(sortableElements, self.selector, sortedCount);
                            sortedMap = buildMapArray(sortedCount);

                            // todo: something with descending.
                            quicksort(sortedKeys, sortedMap, self.comparer, 0, sortedCount - 1);
                            i = 0;

                        case 9:
                            if (!(i < sortedCount)) {
                                context$3$0.next = 15;
                                break;
                            }

                            context$3$0.next = 12;
                            return sortableElements[sortedMap[i]];

                        case 12:
                            i++;
                            context$3$0.next = 9;
                            break;

                        case 15:
                            _iteratorNormalCompletion16 = true;
                            _didIteratorError16 = false;
                            _iteratorError16 = undefined;
                            context$3$0.prev = 18;
                            _iterator16 = unsortedElements[Symbol.iterator]();

                        case 20:
                            if (_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done) {
                                context$3$0.next = 27;
                                break;
                            }

                            v = _step16.value;
                            context$3$0.next = 24;
                            return v;

                        case 24:
                            _iteratorNormalCompletion16 = true;
                            context$3$0.next = 20;
                            break;

                        case 27:
                            context$3$0.next = 33;
                            break;

                        case 29:
                            context$3$0.prev = 29;
                            context$3$0.t0 = context$3$0['catch'](18);
                            _didIteratorError16 = true;
                            _iteratorError16 = context$3$0.t0;

                        case 33:
                            context$3$0.prev = 33;
                            context$3$0.prev = 34;

                            if (!_iteratorNormalCompletion16 && _iterator16['return']) {
                                _iterator16['return']();
                            }

                        case 36:
                            context$3$0.prev = 36;

                            if (!_didIteratorError16) {
                                context$3$0.next = 39;
                                break;
                            }

                            throw _iteratorError16;

                        case 39:
                            return context$3$0.finish(36);

                        case 40:
                            return context$3$0.finish(33);

                        case 41:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, callee$2$0, this, [[18, 29, 33, 41], [34,, 36, 40]]);
            });
            return self;
        }
    }, {
        key: 'thenBy',
        value: function thenBy() {
            var newSelector = arguments[0] === undefined ? function (x) {
                return x;
            } : arguments[0];
            var newComparer = arguments[1] === undefined ? function (x, y) {
                return x > y ? 1 : x < y ? -1 : 0;
            } : arguments[1];

            // wrap the old selector in a new selector function
            // which will build all keys into a primary/secondary structure,
            // allowing the primary key selector to grow recursively
            // by appending new selectors on to the original selectors
            var oldSelector = this.selector; // store pointer to avoid accidental recursion
            this.selector = function (item) {
                return {
                    primary: oldSelector(item),
                    secondary: newSelector(item)
                };
            };

            // wrap the old comparer in a new comparer function
            // which will carry on down the line of comparers
            // in order until a non-zero is found,
            // or until we reach the last comparer
            var oldComparer = this.comparer; // store pointer to avoid accidental recursion
            this.comparer = function (compoundKeyA, compoundKeyB) {
                var primaryResult = oldComparer(compoundKeyA.primary, compoundKeyB.primary);
                if (primaryResult === 0) // ensure stability
                    return newComparer(compoundKeyA.secondary, compoundKeyB.secondary);
                return primaryResult;
            };
            this.update();
            return this;
        }
    }]);

    return OrderedIterable;
})(Iterable);

exports.OrderedIterable = OrderedIterable;

var Iterables = (function () {
    function Iterables() {
        _classCallCheck(this, Iterables);
    }

    _createClass(Iterables, [{
        key: 'from',
        value: function from() {
            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            if (args.length === 1) return new Iterable(args[0]);else if (args.length > 1) return new (_bind.apply(MultiIterable, [null].concat(args)))();else return Iterable.empty();
        }
    }]);

    return Iterables;
})();

exports.Iterables = Iterables;

var iterables = new Iterables();
exports['default'] = iterables;

//         iterables.average = function(iter, selector) {
//             return iterables.sum(iter, selector) / iterables.length(iter);
//         };

//         iterables.contains = function(iter, item, selector) {
//             // can't really use set.has() here, if we want z.equals to be used by default.
//             var comparer;
//             if (z.check.isFunction(item))
//                 comparer = function(x) { return item(x); };
//             else
//                 comparer = function(x, y) { return z.equals(x, y); };
//             if (selector == null || !z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     if (comparer(v, item))
//                         return true;
//                 }
//             }
//             else {
//                 for (var v of _expand(iter)) {
//                     if (comparer(selector(v), item))
//                         return true;
//                 }
//             }
//             return false;
//         };

//         iterables.crossJoin = function(iter1, iter2) {
//             return function*() {
//                 for (var item1 of _expand(iter1)) {
//                     for (var item2 of _expand(iter2)) {
//                         // these if statements are quite a bit faster than flatten was.
//                         if (item1[Symbol.iterator]) {
//                             if (item2[Symbol.iterator])
//                                 yield [...item1, ...item2];
//                             else
//                                 yield [...item1, item2];
//                         }
//                         else {
//                             if (item2[Symbol.iterator])
//                                 yield [item1, ...item2];
//                             else
//                                 yield [item1, item2];
//                         }
//                     }
//                 }
//             }
//         };

//         iterables.distinct = function(iter, selector) {
//             var seen = [];
//             if (z.check.isFunction(selector)) {
//                 return function*() {
//                     for (var v of iter) {
//                         var key = selector(v);
//                         if (!seen.contains(key)) {
//                             seen.push(key);
//                             yield v;
//                         }
//                     }
//                 };
//             }
//             else {
//                 return function*() {
//                     for (var v of iter) {
//                         if (!seen.contains(v)) {
//                             seen.push(v);
//                             yield v; // this works too. may be more efficient?
//                         }
//                     }
//                 };
//             }
//         };

//         iterables.first = function(iter, predicate) {
//             iter = _expand(iter);
//             if (z.check.isFunction(predicate)) {
//                 for (var v of iter) {
//                     if (predicate(v))
//                         return v;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.exists(v))
//                         return v;
//                 }
//             }
//             return null;
//         };

//         // this is bad for performance.
//         // find a way around it?
//         // start storing data as array by default?
//         function* _flatten(iter) {
//             if (!z.check.isIterable(iter))
//                 yield iter;
//             else {
//                 for (var v of _expand(iter)) {
//                     if (!z.check.isIterable(v)) // this will be a problem with anything other than objects.
//                         yield v;
//                     else
//                         yield* _flatten(v);
//                 }
//             }
//         };
//         iterables.flatten = function(iter) {
//             return _flatten(iter);
//         };

//         iterables.isEmpty = function(iter) {
//             for (var v of _expand(iter))
//                 if (z.check.exists(v))
//                     return false;
//             return true;
//         };

//         iterables.isFull = function(iter) {
//             for (var v of _expand(iter))
//                 if (!z.check.exists(v))
//                     return false;
//             return true;
//         };

//         iterables.join = function(iter1, iter2) {
//             return function*() {
//                 for (var item1 of _expand(iter1)) {
//                     for (var item2 of _expand(iter2)) {
//                         var group = new Grouping();
//                         if (item1 instanceof Grouping) {
//                             if (item2 instanceof Grouping)
//                                 group.push(...item1, ...item2);
//                             else
//                                 group.push(...item1, item2);
//                         }
//                         else {
//                             if (item2 instanceof Grouping)
//                                 group.push(item1, ...item2);
//                             else
//                                 group.push(item1, item2);
//                         }
//                         yield group;
//                     }
//                 }
//             };
//         };

//         iterables.last = function(iter, predicate) {
//             // we will have to iterate over the entire iterable in the generic case
//             // array has its own specific implementation for last, since we know the end
//             var current,
//                 previous,
//                 result = null,
//                 expandedIter = _expand(iter);

//             if (z.getType(iter) === z.types.array)
//                 return z.arrays.last(iter, predicate);
//             if (z.check.isFunction(predicate)) {
//                 while (!(current = expandedIter.next()).done) {
//                     if (predicate(current.value))
//                         result = current.value;
//                 }
//             }
//             else {
//                 while (!(current = expandedIter.next()).done)
//                     previous = current; // or we could just assign result = a.value -- could be less efficient.
//                 result = previous.value; // current will step "past" the end. previous will be the final.
//             }
//             return result;
//         };

//         iterables.length = function(iter) {
//             // shortcut if we have array / set / map / etc
//             if (iter.length && z.getType(iter.length) === z.types.number)
//                 return iter.length;
//             var len = 0;
//             for (var v of iter)
//                 len++;
//             return len;
//         };

//         iterables.max = function(iter, selector) {
//             var maxValue = Number.MIN_VALUE;
//             if (z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     var selected = selector(v);
//                     if (z.check.isNumber(selected) && maxValue < selected)
//                         maxValue = selected;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.isNumber(v) && maxValue < v)
//                         maxValue = v;
//                 }
//             }
//             return maxValue;
//         };

//         iterables.min = function(iter, selector) {
//             var minValue = Number.MAX_VALUE;
//             if (z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     var selected = selector(v);
//                     if (z.check.isNumber(selected) && selected < minValue)
//                         minValue = selected;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.isNumber(v) && v < minValue)
//                         minValue = v;
//                 }
//             }
//             return minValue;
//         };

//         var buildMapArray = function(count) {
//             var mapArray = new Array(count);
//             for (var i = 0; i < count; i++)
//                 mapArray[i] = i;
//             return mapArray;
//         };
//         var buildKeyArray = function(elements, selector, count) {
//             var keyArray = new Array(count);
//             for (var i = 0; i < count; i++)
//                 keyArray[i] = selector(elements[i]);
//             return keyArray;
//         };
//         var quicksort3 = function(keyArray, mapArray, comparer, left, right) {
//             var indexForLessThan = left;
//             var indexForGreaterThan = right;
//             var pivotIndex = mapArray[left];
//             var indexForIterator = left+1;
//             while (indexForIterator <= indexForGreaterThan) {
//                 var cmp = comparer(keyArray[mapArray[indexForIterator]], keyArray[pivotIndex]);
//                 if (cmp < 0)
//                     z.arrays.swap(mapArray, indexForLessThan++, indexForIterator++);
//                 else if (0 < cmp)
//                     z.arrays.swap(mapArray, indexForIterator, indexForGreaterThan--);
//                 else
//                     indexForIterator++;
//             }
//             if (left < indexForLessThan-1)
//                 quicksort3(keyArray, mapArray, comparer, left, indexForLessThan-1);
//             if (indexForGreaterThan+1 < right)
//                 quicksort3(keyArray, mapArray, comparer, indexForGreaterThan+1, right);
//         };
//         iterables.orderBy = function(iter, selector, comparer) {
//             if (!z.check.isFunction(selector))
//                 selector = z.functions.identity;
//             if (!z.check.exists(comparer))
//                 comparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

//             var yielder = function*() {
//                 // only execute the sort on iteration
//                 // this is due to the possibly orderBy().thenBy().thenBy() chained calls
//                 var elements = (z.getType(iter) === z.types.generator ? iterables.toArray(iter) : iter);
//                 var unsortedElements = iterables.toArray(
//                     iterables.where(elements, x => yielder.selector(x) == null)
//                 );
//                 var unsortedCount = unsortedElements.length;
//                 var sortedElements = iterables.toArray(
//                     iterables.where(elements, x => yielder.selector(x) != null)
//                 );
//                 var sortedCount = sortedElements.length;
//                 var sortedKeys = buildKeyArray(sortedElements, yielder.selector, sortedCount);
//                 var sortedMap = buildMapArray(sortedCount);
//                 quicksort3(sortedKeys, sortedMap, yielder.comparer, 0, sortedCount-1);
//                 for (var i = 0; i < sortedCount; i++)
//                     yield sortedElements[sortedMap[i]];
//                 for (var v of unsortedElements)
//                     yield v;
//                 return;
//             };

//             z.defineProperty(yielder, "thenBy", { enumerable: false, writable: true, configurable: true, value: thenBy.bind(yielder) });
//             z.defineProperty(yielder, "selector", { enumerable: false, writable: true, configurable: true, value: selector });
//             z.defineProperty(yielder, "comparer", { enumerable: false, writable: true, configurable: true, value: comparer });
//             return yielder;
//         };

//         var thenBy = function(newSelector, newComparer) {
//             var self = this;
//             if (!z.check.isFunction(newComparer))
//                 newComparer = ((x,y) => x > y ? 1 : x < y ? -1 : 0);

//             // wrap the old selector in a new selector function
//             // which will build all keys into a primary/secondary structure,
//             // allowing the primary key selector to grow recursively
//             // by appending new selectors on to the original selectors
//             var oldSelector = self.selector; // store pointer to avoid accidental recursion
//             self.selector = function(item) {
//                 return {
//                     primary: oldSelector(item),
//                     secondary: newSelector(item)
//                 }
//             };

//             // wrap the old comparer in a new comparer function
//             // which will carry on down the line of comparers
//             // in order until a non-zero is found, or until
//             // we reach the new comparer
//             var oldComparer = self.comparer; // store pointer to avoid accidental recursion
//             self.comparer = function(compoundKeyA, compoundKeyB) {
//                 var primaryResult = oldComparer(compoundKeyA.primary, compoundKeyB.primary);
//                 if (primaryResult === 0)
//                     return newComparer(compoundKeyA.secondary, compoundKeyB.secondary);
//                 return primaryResult;
//             };

//             return self;
//         };

//         var _reverse = function*(iter, a) {
//             if (!a.done) {
//                 yield* _reverse(iter, iter.next());
//                 yield a.value;
//             }
//         };
//         iterables.reverse = function(iter) {
//             return function*() {
//                 var expandedIter = _expand(iter);
//                 yield* _reverse(expandedIter, expandedIter.next());
//             };
//         };

//         iterables.select = function(iter, selector) {
//             // // comprehension style (ES7) -- still slow, external comprehensions about 100x faster.
//             // return (
//             //     for (v of _expand(iter))
//             //     selector(...iterables.flatten(v))
//             // );

//             // return function*() {
//             //     for (var v of _expand(iter)) {
//             //         if (v[Symbol.iterator])
//             //             yield selector(...v);
//             //         else
//             //             yield selector(v);
//             //     }
//             // };

//             // grouping version
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (v instanceof Grouping)
//                         yield selector(...v);
//                     else
//                         yield selector(v);
//                 }
//             };

//             // original version
//             // return function*() {
//             //     for (var v of _expand(iter)) {
//             //         yield selector(
//             //             ...( // spread
//             //                 iterables.flatten(v) // keep procedural as much as possible
//             //             )
//             //         );
//             //     }
//             // };
//         };

//         iterables.skip = function(iter, count) {
//             return function*() {
//                 var a,
//                     i = 0,
//                     expandedIter = _expand(iter);
//                 while (!(a = expandedIter.next()).done && i < count)
//                     i++;
//                 if (!a.done) {
//                     yield a.value; // yield the value at the starting point
//                     while(!(a = expandedIter.next()).done)
//                         yield a.value; // yield remaining values
//                 }
//             }
//         };

//         iterables.sum = function(iter, selector) {
//             var sum = 0;
//             if (z.check.isFunction(selector)) {
//                 for (var v of iter) {
//                     var num = selector(v);
//                     if (z.check.isNumber(num))
//                         sum += num;
//                 }
//             }
//             else {
//                 for (var v of iter) {
//                     if (z.check.isNumber(v))
//                         sum += v;
//                 }
//             }
//             return sum;
//         };

//         iterables.take = function(iter, count) {
//             return function*() {
//                 var i = 0;
//                 for (var v of _expand(iter)) {
//                     if (count <= i++)
//                         break;
//                     yield v;
//                 }
//             };
//         };

//         iterables.takeWhile = function(iter, predicate) {
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (!predicate(v))
//                         break;
//                     yield v;
//                 }
//             };
//         };

//         iterables.toArray = function(iter) {
//             return ([..._expand(iter)]);
//         };

//         iterables.where = function(iter, predicate) {
//             "use strict";
//             // note - this gets crushed by generator comprehensions for performance
//             // this gets crushed by plain comprehensions for performance
//             // only real gain here is chainability with the other methods,
//             // as well as the ability to execute a predicate which contains
//             // additional logic (which may be an anti-pattern anyways).

//             // grouping version
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (v instanceof Grouping) {
//                         if (predicate(...v))
//                             yield v;
//                     }
//                     else {
//                         if (predicate(v))
//                             yield v;
//                     }
//                 }
//             };

//             // // old version
//             // return function*() {
//             //     for (var v of _expand(iter)) {
//             //         if (v[Symbol.iterator]) { // hacky? safe? its certainly faster.. worth losing safety for speed?
//             //             if (predicate(...v))
//             //                 yield v;
//             //         }
//             //         else {
//             //             if (predicate(v))
//             //                 yield v;
//             //         }
//             //     }
//             // };
//         };

//         iterables.where_safe = function(iter, predicate) {
//             "use strict";
//             // note - this gets crushed by generator comprehensions for performance
//             // this gets crushed by plain comprehensions for performance
//             // only real gain here is chainability with the other methods,
//             // as well as the ability to execute a predicate which contains
//             // additional logic (which may be an anti-pattern anyways).
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (predicate(v))
//                         yield v;
//                 }
//             };
//         };

//         iterables.zip = function(iter1, iter2, method) {
//             return function*() {
//                 var a, b;
//                 var expandedIter1 = _expand(iter1);
//                 var expandedIter2 = _expand(iter2);
//                 while (!(a = expandedIter1.next()).done && !(b = expandedIter2.next()).done)
//                     yield method(a.value, b.value);
//             };
//         };

//         z.iterables = iterables;

//         // wrapper class
//         // this should be used whenever generator extensions are not being used
//         // (HIGHLY SUGGESTED)
//         var Iterable = (function() {
//             function Iterable(iterable) {
//                 var self = this;
//                 if (z.check.isIterable(iterable))
//                     // note that this sort of falls apart
//                     // if the end user passes in an iterable of iterables
//                     // (so an array of arrays, array of sets, etc)

//                     // so here's the trade off.
//                     // do we want joins with function parameter selection,
//                     // or do we want users to use iterables of iterables as the source?
//                     self.data = iterable;
//                 else
//                     return null;
//                 return self;
//             }
//             // prototype items can also go here
//             return Iterable;
//         }());

//         // this should take the place of the array being yielded
//         // with multiple tables / data sets.
//         // this is a slight performance hit
//         function Grouping() {}
//         Grouping.prototype = new Array; // lovely "inherit" shenanigans

//         // function* _prod(arrs, current, index) {
//         //     if (index == arrs.length-1) {
//         //         for (var v of arrs[index]) {
//         //             current[index] = v;
//         //             yield([...current]); // needs to be a copy, since
//         //         }
//         //     }
//         //     else {
//         //         for (var v of arrs[index]) {
//         //             current[index] = v;
//         //             yield* _prod(arrs, current, index+1);
//         //         }
//         //     }
//         // }
//         // function prod(...arrs) {
//         //     return function*() {
//         //         yield* _prod(arrs, [], 0);
//         //     }
//         // }

//         // place helper method on the root
//         z.from = function(iterable) {
//             return new Iterable(iterable);
//         };

//         Iterable.prototype[Symbol.iterator] = function() {
//             return _expand(this.data);
//         };

//         // this doesn't work yet,
//         // since Symbol.toStringTag isn't available.
//         // See: https://mail.mozilla.org/pipermail/es-discuss/2015-January/041149.html
//         // Also see at 19.1.3.6.14: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
//         Iterable.prototype['@@toStringTag'] = function() {
//             z.log('hit tostringtag for iterable');
//             return '[object Iterable]'; // for z.getType usage
//         };

//         Iterable.prototype.aggregate = function(func, seed) {
//             this.data = iterables.aggregate(this.data, func, seed);
//             return this;
//         };

//         Iterable.prototype.any = function(predicate) {
//             return iterables.any(this.data, predicate);
//         };

//         Iterable.prototype.at = function(index) {
//             return iterables.at(this.data, index);
//         };

//         Iterable.prototype.average = function(selector) {
//             return iterables.average(this.data, selector);
//         };

//         Iterable.prototype.concat = function(/* ... iter */) {
//             var args = Array.prototype.slice.call(arguments);
//             this.data = iterables.concat(this.data, ...args); // cant we just use ...arguments?
//             return this;
//         };

//         Iterable.prototype.crossJoin = function(iter2) {
//             this.data = iterables.crossJoin(this.data, iter2);
//             return this;
//         };

//         Iterable.prototype.contains = function(item, selector) {
//             return iterables.contains(this.data, item, selector);
//         };

//         Iterable.prototype.distinct = function(selector) {
//             this.data = iterables.distinct(this.data, selector);
//             return this;
//         };

//         Iterable.prototype.first = function(selector) {
//             return iterables.first(this.data, selector);
//         };

//         Iterable.prototype.flatten = function() {
//             this.data = iterables.flatten(this.data);
//             return this;
//         };

//         Iterable.prototype.innerJoin = function(iter2) {
//             this.data = iterables.innerJoin(this.data, iter2);
//             return this;
//         };

//         Iterable.prototype.isEmpty = function() {
//             return iterables.isEmpty(this.data);
//         };

//         Iterable.prototype.isFull = function() {
//             return iterables.isFull(this.data);
//         };

//         Iterable.prototype.join = function(iter2, predicate, selector) {
//             // if (this.data instanceof Grouping)
//             //     this.data.add(iter2);
//             // else
//             //     this.data = new Grouping(this.data, iter2);
//             this.data = iterables.join(this.data, iter2);
//             return this;
//             // this.data = iterables.join(this.data, iter2, predicate, selector);
//             // return this;
//         };

//         Iterable.prototype.last = function(predicate) {
//             return iterables.last(this.data, predicate);
//         };

//         Iterable.prototype.leftJoin = function(iter2) {
//             this.data = iterables.leftJoin(this.data, iter2);
//             return this;
//         };

//         Iterable.prototype.max = function(selector) {
//             return iterables.max(this.data, selector);
//         };

//         Iterable.prototype.min = function(selector) {
//             return iterables.min(this.data, selector);
//         };

//         Iterable.prototype.on = function(predicate) {
//             // extension to help with innerJoin
//             // note that innerJoin MUST be called first. error trapping?
//             this.data = this.data.on(predicate);
//             return this;
//         };

//         Iterable.prototype.orderBy = function(selector, comparer) {
//             this.data = iterables.orderBy(this.data, selector, comparer);
//             return this;
//         };

//         Iterable.prototype.thenBy = function(selector, comparer) {
//             // extension to help with orderBy
//             // note that orderBy MUST be called first. error trapping?
//             this.data = this.data.thenBy(selector, comparer);
//             return this;
//         };

//         Iterable.prototype.reverse = function() {
//             this.data = iterables.reverse(this.data);
//             return this;
//         };

//         Iterable.prototype.select = function(selector) {
//             this.data = iterables.select(this.data, selector);
//             return this;
//         };

//         Iterable.prototype.skip = function(count) {
//             this.data = iterables.skip(this.data, count);
//             return this;
//         };

//         Iterable.prototype.sum = function(selector) {
//             this.data = iterables.sum(this.data, selector);
//             return this;
//         };

//         Iterable.prototype.take = function(count) {
//             this.data = iterables.take(this.data, count);
//             return this;
//         };

//         Iterable.prototype.toArray = function() {
//             if (z.check.isArray(this.data))
//                 return this.data;
//             return iterables.toArray(this.data);
//         };

//         Iterable.prototype.where = function(predicate) {
//             this.data = iterables.where(this.data, predicate);
//             return this;
//         };

//         Iterable.prototype.where_safe = function(predicate) {
//             this.data = iterables.where_safe(this.data, predicate);
//             return this;
//         };

//         Iterable.prototype.where2 = function(predicate) {
//             this.data = iterables.where2(this.data, predicate);
//             return this;
//         };

//         iterables.where2 = function*(iter, predicate) {
//             // this is without a doubt the fastest
//             // but we lose the ability to "join" other data sets.
//             for (var v of _expand(iter)) {
//                 if (predicate(v))
//                     yield v;
//             }
//         };

//         Iterable.prototype.where3 = function(predicate) {
//             this.data = iterables.where3(this.data, predicate);
//             return this;
//         };

//         iterables.where3 = function*(iter, predicate) {
//             for (var v of _expand(iter)) {
//                 if (predicate(...iterables.flatten(v)))
//                     yield v;
//             }
//         };

//         Iterable.prototype.where4 = function(predicate) {
//             // this is the original, no flatten method.
//             // is it worth keeping flatten for internal joins,
//             // or should we just dump the idea of joins altogether?
//             // we really need a more performant way to pull joins off,
//             // if we are going to continue on with them.
//             this.data = iterables.where4(this.data, predicate);
//             return this;
//         };

//         iterables.where4 = function(iter, predicate) {
//             return function*() {
//                 for (var v of _expand(iter)) {
//                     if (predicate(v))
//                         yield v;
//                 }
//             };
//         };

//         Iterable.prototype.arraywhere = function(predicate) {
//             // for performance checking reasons
//             this.data = z.arrays.where(this.data, predicate);
//             return this;
//         };

//         Iterable.prototype.zip = function(iter2, method) {
//             this.data = iterables.where(this.data, iter2, method);
//             return this;
//         };

//         Iterable.prototype.getType = function() {
//             return '[object Iterable]'; // hacky fix until Symbol.toStringTag is available.
//         };

//         z.classes.Iterable = Iterable; // put on classes in case users want to use new Iterable() instead of z.from
//     }

//     /**
//         Locate root, and determine how to use the factory method.
//     */
//     var root = (
//         typeof window !== 'undefined' ?
//             window
//             :  typeof global !== 'undefined' ?
//                 global
//                 : this
//     );
//     if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
//         // define.amd exists
//         define(function() { return factory; });
//         root.z = z; // expose to root in case require() is not being used to load zana
//     }
//     else if (typeof module !== 'undefined') {
//         if (typeof module.exports !== 'undefined') {
//             module.exports = factory;
//         }
//     }
//     else if (typeof root.z !== 'undefined') {
//         // pass root.z to the factory
//         factory(root.z);
//     }
// }());
// dangerous? inefficient? seems like it.