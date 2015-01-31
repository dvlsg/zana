/**
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    "use strict";
    /**
        The main container for all zUtil items.

        @param [object] settings An optional set of settings to define items.
        @param [boolean] settings.useArrayExtensions A boolean flag to determine whether or not to extend Array.prototype.
        @param [boolean] settings.useObjectExtensions A boolean flag to determine whether or not to extend Object.prototype.
        @param [object] settings.defaultLogger An object which defines all of the required logger fields to be used by zUtil.log.
    */
    function Zana(/* settings */) {
        // this.setup(settings);
    }
    var z = new Zana();

    /**
        Class for containing a max reference counter
        as well as two stacks of references to objects.
        To be used with deepCopy and equals.
        
        @class Contains two reference stacks as well as a defined max stack depth.
    */
    var RecursiveCounter = (function() {
        function RecursiveCounter(maxStackDepth) {
            this.xStack = [];
            this.yStack = [];
            this.count = 0;
            this.maxStackDepth = maxStackDepth;
        }
        RecursiveCounter.prototype.push = function(x, y) {
            this.xStack.push(x);
            this.yStack.push(y);
            this.count++;
        };
        RecursiveCounter.prototype.pop = function() {
            this.xStack.pop();
            this.yStack.pop();
            this.count--;
        };
        return RecursiveCounter;
    })();

    /**
        Collects the type for a given value.
        
        @param {any} value The value from which to collect the type.
        @returns {string} The type of the value.
    */

    // var generatorFunctionProto = function*(){}.constructor; // not helpful, these are considered "functions".
    var generatorProto = function*(){}().constructor;
    z.getType = function(value) {
        // this is bad, but I don't think we have any other options yet.
        // see: https://mail.mozilla.org/pipermail/es-discuss/2015-January/041149.html
        // if (value && value.getType)
            // return value.getType();

        // lets ditch the regexp for performance
        return Object.prototype.toString.call(value); // just use z.types['type'] for readability.

        // this is more efficient (by a lot), but less extendable
        var t = typeof value;
        if (t !== 'object')
            return t;
        if (value === null)
            return 'null';
        switch(value.constructor) {
            case Array:             return 'array';
            case String:            return 'string';
            case Number:            return 'number';
            case Boolean:           return 'boolean';
            case RegExp:            return 'regexp';
            case Date:              return 'date';
            case Set:               return 'set';
            case Map:               return 'map';
            case WeakSet:           return 'weakset';
            case WeakMap:           return 'weakmap';
            case generatorProto:    return 'generator';
        }
        if (value && value.getType)
            return value.getType();
        // if (z.classes && z.classes.Iterable && value.constructor === z.classes.Iterable)
            // return 'iterable'; // haaaaaacky. this works, though. take the performance hit for now?

        // what about iterables?
        return 'object';
    };

    /**
        Returns the first non-null or non-undefined argument.

        @param {...any} var_args The list of arguments to check for existence.
        @returns {any} If no arguments exist then null, else the existing argument.
    */
    z.coalesce = function(/* arguments */) {
        var args = [...arguments];
        for (var i = 0; i < args.length; i++) {
            if (z.check.exists(args[i]))
                return args[i];
        }
        return null;
    };

    /**
        Builds a deep copy of the provided source.
        
        @param {any} origSource The item from which to build the deep copy.
        @returns {any} The copy of the provided source.
        @throws {error} An error is thrown if the recursive object stack grows greater than 1000.
    */
    z.deepCopy = function(origSource) {
        var origIndex = -1;
        var rc = new RecursiveCounter(1000);

        function _singleCopy(sourceRef, copyRef) {
            origIndex = rc.xStack.indexOf(sourceRef);
            if (origIndex === -1) {
                rc.push(sourceRef, copyRef);
                z.forEach(sourceRef, function(value, key) {
                    copyRef[key] = _deepCopy(value);
                });
                rc.pop();
                return copyRef;
            }
            else {
                // source item has already been copied
                // return the reference to the copied item
                return rc.yStack[origIndex];
            }
        }

        function _funcCopy(source) {
            var temp = function() { return source.apply(source, arguments); };
            z.forEach(source, function(x, key) {
                temp[key] = _deepCopy(x);
            });
            return _singleCopy(source, temp);
        }

        function _deepCopy(source) {
            if (rc.count > rc.maxStackDepth) throw new Error("Stack depth exceeded: " + rc.stackMaxDepth + "!");
            switch (z.getType(source)) {
                case z.types.object:
                    return _singleCopy(source, Object.create(Object.getPrototypeOf(source)));
                case z.types.array:
                    return _singleCopy(source, []);
                case z.types.regexp:
                    return _singleCopy(source, new RegExp(source));
                case z.types.date:
                    return _singleCopy(source, new Date(source.toString()));
                case z.types.set:
                    return _singleCopy(source, new Set());
                case z.types.map:
                    return _singleCopy(source, new Map()); // might not work / need a _mapCopy?

                // case z.types.function:
                    // return _funcCopy(source);
                // generator functions? just use pointers? or do we want to iterate and replace?
                default: // need to handle functions differently?
                    return source;
            }
        }
        return _deepCopy(origSource);
    };

    /**
        Defines a property on this provided item.
        
        @this {object}
        @param {any} obj The item to which to add the property.
        @param {string} name The name of the property.
        @param {any} prop The property to add.
        @returns {void}
    */
    z.defineProperty = function(obj, name, prop) {
        if (obj[name] == null)
            Object.defineProperty(obj, name, prop); 
        else {
            console.error(
                "Error: the method " 
                + name
                + " has already been defined on the following object: " 
                + obj
            );
        }
    };

    /**
        Compares the equality of two provided items.
        
        @param {any} x The first item to compare.
        @param {any} y The second item to compare.
        @returns {boolean} True if the provided values are equal, false if not.
        @throws {error} An error is thrown if the recursive function stack grows greater than 1000.
    */
    z.equals = function(x, y) {
        var rc = new RecursiveCounter(1000);

        function _compareObject(x, y) {
            // check for reference equality
            if (x === y)
                return true;
            var xKeys = Object.keys(x);
            var yKeys = Object.keys(y);
            xKeys.quicksort();
            yKeys.quicksort();
            if (!_equals(xKeys, yKeys))
                return false;
            rc.push(x, y);
            for (var k in x) {
                if (!_equals(x[k], y[k]))
                    return false;
            }
            rc.pop();
            return true;
        }

        function _equals(x, y) {
            if (rc.count > rc.maxStackDepth) throw new Error("Stack depth exceeded: " + rc.maxStackDepth + "!");
            // check for reference and primitive equality
            if (x === y)
                return true;
            // check for type equality
            var xType = z.getType(x);
            var yType = z.getType(y);
            if (xType !== yType)
                return false;
            // check for circular references
            var xIndex = rc.xStack.lastIndexOf(x);
            var yIndex = rc.yStack.lastIndexOf(y);
            if (xIndex !== -1) {
                if (yIndex !== -1) {
                    // don't care about object reference equality
                    // when checking for object equality
                    return true;
                    // if we do care about object reference equality,
                    // then a strict comparison of stack location of objects
                    // needs to be executed and returned
                }
            }
            // check for inequalities
            switch(xType) {
                case z.types.date:
                    if (x.getTime() !== y.getTime()) {
                        return false;
                    }
                    // check for extra properties stored on the Date object
                    if (!_compareObject(x, y)) {
                        return false;
                    }
                    break;
                case z.types.function:
                    // if (!z.equals(z.functions.getBody(x), z.functions.getBody(y))) {
                    //     // function body mismatch
                    //     return false;
                    // }
                    // if (!z.equals(z.functions.getArgumentNames(x), z.functions.getArgumentNames(y))) {
                    //     // function arguments mismatch
                    //     return false;
                    // }
                    if (!_compareObject(x, y)) // check for properties set on the function
                        return false;
                    break;
                case z.types.array:
                    if (x.length !== y.length) {
                        return false;
                    }
                    rc.push(x, y);
                    for (var i = 0; i < x.length; i++) {
                        if (!_equals(x[i], y[i])) {
                            return false;
                        }
                    }
                    rc.pop();
                    break;
                case z.types.generator:
                case z.types.generatorFunction:
                    // do we really want to check generator equality other than reference equality?
                    // this could accidentally execute some lazy-loading stuff.
                    rc.push(x, y);
                    var a, b;
                    var tempX = x[z.symbols.iterator](); // these point to the same object, after the Symbol.iterator get override
                    var tempY = y[z.symbols.iterator]();
                    do {
                        a = tempX.next();
                        b = tempY.next();
                        if (!_equals(a.value, b.value)) {
                            return false;
                        }
                    } while (!(a.done || b.done));
                    if (a.done !== b.done)
                        return false;
                    rc.pop();
                    break;
                case z.types.function: // check for properties set on the function
                case z.types.object:
                case z.types.regexp:
                    if (!_compareObject(x, y))
                        return false;
                    break;
                default:
                    if (x !== y)
                        return false;
                    break;
            }
            return true;
        }
        return _equals(x, y);
    };

    /**
        Internal extend call.
        Performance abstraction to bypass all the argument shenanigans,
        as we know we will only be extending two items at a time internally.

        @param {any} a The item on which to extend the second.
        @param {any} b The item to extend onto the first.
        @returns {any} The reference to the first item.
    */
    var _extend = function(a, b) {
        z.forEach(b, function(val, key) {
            if (!z.check.exists(a[key]))
                a[key] = b[key];
            else if (z.check.isSmashable(a[key], b[key]))
                _extend(a[key], b[key]);
        });
        return a;
    };

    /**
        Extends the properties on the provided arguments into the original item.
        Any properties on the tail arguments will not overwrite
        any properties on the first argument, and any references will be shallow.
        
        @param {any} a The target to be extended.
        @param {...any} rest The tail items to extend onto the target.
        @returns {any} A reference to the extended target.
    */
    z.extend = function(a, ...rest) {
        rest.forEach(function(b) {
            if (z.check.isSmashable(a, b))
                _extend(a, b);
        });
        return a;
    };

    /**
        Iterates over an iterable object or array,
        calling the provided method with the provided optional context,
        as well as the value and the key for the current item.

        @param {object|array|date|regexp} item The item over which to iterate.
        @param {function} method The method to call for each iterated item.
        @param {object} context The context to set to "this" for the method.
        @returns {object|array|date|regexp} The reference to the original item.
    */
    z.forEach = function(item, method, context) {
        var itemType = z.getType(item);
        switch(itemType) {
            case z.types.date:
            case z.types.function:
            case z.types.object:
            case z.types.regexp:
                // for (var [key, value] of item) { // this doesn't work quite yet, but is the eventual goal. (2015-01-31)
                for (var key in item) {
                    if (item.hasOwnProperty(key))
                        method.call(context, value, key, item);
                }
                break;
            case z.types.arguments:
            case z.types.array: // var [key, value] of arr doesn't quite work yet (2015-01-31)
                for (var i = 0; i < item.length; i++)
                    method.call(context, item[i], i, item);
                break;
            case z.types.map: // weakmap is not iterable (?)
                for (var [key, value] of m)
                    method.call(context, value, key, item);
                break;
            case z.types.set: // weakset is not iterable (?)
                for(var value of item) // treat keys and values as equivalent for sets
                    method.call(context, value, value, item);
                break;
            case z.types.iterable: // still need to find a way to handle this
                for(var v of item) // this.. doesnt work.
                    method.call(context, value, undefined, item);
                break;
        }
        return item;
    };

    /**
        Internal smash call.
        Performance abstraction to bypass all the argument shenanigans,
        as we know we will only be smashing two items at a time internally.

        @param {any} a The item on which to smash the second.
        @param {any} b The item to smash onto the first.
        @returns {any} The reference to the first item.
    */
    var _smash = function(a, b) {
        z.forEach(b, function(val, key) {
            if (z.check.isSmashable(a[key], b[key]))
                _smash(a[key], b[key]);
            else
                a[key] = z.deepCopy(b[key]);
        });
        return a;
    };

    /**
        Smashes the properties on the provided arguments into the first argument.
        Any properties on the tail arguments will overwrite
        any existing properties on the first argument.
        
        @param {any} a The target to be smashed.
        @param {...any} rest The tail items to smash onto the target.
        @returns {any} A reference to the smashed target.
    */
    z.smash = function(a, ...rest) {
        rest.forEach(function(b) {
            if (z.check.isSmashable(a, b))
                _smash(a, b);
        });
        return a;
    };

    /**
        Executes setup methods based on the provided settings object.
         
        @param {object} settings The settings object.
        @param {boolean} [settings.useArrayExtensions]  A boolean flag used to determine whether or not to extend Array.prototype.
        @param {boolean} [settings.useNumberExtensions] A boolean flag used to determine whether or not to extend Number.prototype.
        @param {boolean} [settings.useObjectExtensions] A boolean flag used to determine whether or not to extend Object.prototype.
        @param {object} [settings.defaultLogger] The default logger interface to apply to the default zUtil.log class.
    */
    z.setup = function(settings) {
        settings = settings || {};
        if (z.setup.initArrays)
            z.setup.initArrays(settings.useArrayExtensions);
        if (z.setup.initFunctions)
            z.setup.initFunctions(settings.useFunctionExtensions);
        if (z.setup.initGenerators)
            z.setup.initGenerators(settings.useGeneratorExtensions);
        if (z.setup.initNumbers)
            z.setup.initNumbers(settings.useNumberExtensions);
        if (z.setup.initObjects)
            z.setup.initObjects(settings.useObjectExtensions);
        if (z.setup.initLogger)
            z.setup.initLogger(settings.defaultLogger);
    };

    /**
        Define constants for the library.
     */
    z.functions = {
        'identity': function(x) { return x; }
        , 'true': function() { return true; }
        , 'false': function() { return false; }
        , 'empty': function() { }
        , 'matcher': /^(?:[(\s*]*)?(\w+(?:,\s*\w+)*)?(?:[)\s*]*)?=>(?:\s*)?(.*)$/
    };
    z.types = {
          'arguments':          z.getType(arguments) 
        , 'array':              z.getType([])
        , 'boolean':            z.getType(true)
        , 'date':               z.getType(new Date())
        , 'generator':          z.getType(function*(){}())
        , 'generatorFunction':  z.getType(function*(){})
        , 'function':           z.getType(function(){})
        , 'map':                z.getType(new Map())
        , 'null':               z.getType(null)
        , 'number':             z.getType(0)
        , 'object':             z.getType({})
        , 'regexp':             z.getType(new RegExp())
        , 'string':             z.getType('')
        , 'set':                z.getType(new Set())
        , 'undefined':          z.getType(undefined)
        , 'weakmap':            z.getType(new WeakMap())
        , 'weakset':            z.getType(new WeakSet())
        , 'iterable':           'Iterable' // CHEATING! SO MUCH CHEATING! might get better when we can use class Iterable() construct.
    };
    z.generators = {
        'empty': function*() { }
    };
    // z.symbols = {
    //     "iterator": "@@iterator" // should be Symbols.iterator eventually -- probably dont need to maintain this list once Symbols exists
    // };

    return (function() {
        var root = (
            typeof window !== 'undefined' ?
                window
                : typeof global !== 'undefined' ?
                    global 
                    : this
        );
        if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
            root.z = z;
            define(function() {
                return z;
            });
        }
        else if (typeof module !== 'undefined') {
            if (typeof module.exports !== 'undefined') {
                module.exports = z;
            }
        }
        else {
            // assume browser, expose to root
            root.z = z;
        }
        return z;
    })();
})();