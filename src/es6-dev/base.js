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
    z.getType = function(value) {
        return Object.prototype.toString.call(value).match(/^\[object (.+)\]$/)[1];
    };

    /**
        Returns the first non-null or non-undefined argument.

        @param {...any} var_args The list of arguments to check for existence.
        @returns {any} If no arguments exist then null, else the existing argument.
    */
    z.coalesce = function(/* arguments */) {
        var args = Array.prototype.slice.call(arguments);
        for (var i = 0; i < args.length; i++) {
            if (z.check.exists(args[i])) {
                return args[i];
            }
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
                case z.types.function:
                    return _funcCopy(source);
                // generator functions?
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
        if (obj[name] == null) {
            Object.defineProperty(obj, name, prop); 
        }
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
            if (x === y) {
                return true;
            }
            var xKeys = Object.keys(x);
            var yKeys = Object.keys(y);
            xKeys.quicksort();
            yKeys.quicksort();
            if (!_equals(xKeys, yKeys)) {
                return false;
            }
            rc.push(x, y);
            for (var k in x) {
                if (!_equals(x[k], y[k])) {
                    return false;
                }
            }
            rc.pop();
            return true;
        }

        function _equals(x, y) {
            if (rc.count > rc.maxStackDepth) throw new Error("Stack depth exceeded: " + rc.maxStackDepth + "!");
            // check for reference and primitive equality
            if (x === y) {
                return true;
            }
            // check for type equality
            var xType = z.getType(x);
            var yType = z.getType(y);
            if (xType !== yType) {
                return false;
            }
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
                    if (!_compareObject(x, y)) {
                        // property mismatch on function
                        return false;
                    }
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
                    if (a.done !== b.done) {
                        return false;
                    }
                    rc.pop();
                    break;
                case z.types.object:
                case z.types.regexp:
                    if (!_compareObject(x, y)) {
                        return false;
                    }
                    break;
                default:
                    if (x !== y) {
                        return false;
                    }
                    break;
            }
            return true;
        }
        return _equals(x, y);
    };

    /**
        Extends the properties on the provided arguments into the original item.
        Any properties on the tail arguments will not overwrite
        any existing properties on the first argument.
        
        @param {...any} var_args The tail items to smash.
        @returns {any} A newly extended item.
        @throws {error} An error is thrown if any of the provided arguments have different underlying types.
    */
    z.extend = function(/* arguments */) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length <= 0) {
            return null;
        }
        if (args.length === 1) {
            return args[0];
        }
        var target = args[0];
        var callback = function(value, key, arg) {
            if (!z.check.exists(target[key])) {
                target[key] = args[i][key];
            }
            else {
                if (z.check.isSmashable(target[key], arg[key])) {
                    target[key] = z.smash(target[key], arg[key]);
                }
            }
        };
        for (var i = 1; i < args.length; i++) {
            z.assert.isSmashable(target, args[i]);
            z.forEach(args[i], callback);
        }
        return target;
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
        console.log(itemType);
        switch(itemType) {
            case z.types.date:
            case z.types.function:
            case z.types.object:
            case z.types.regexp:
                for (var key in item) {
                    if (item.hasOwnProperty(key)) {
                        method.call(context, item[key], key, item);
                    }
                }
                break;
            case z.types.arguments:
            case z.types.array:
                for (var i = 0; i < item.length; i++) {
                    method.call(context, item[i], i, item);
                }
                break;
            case 'Iterable':
                for(var v of item) {
                    method.call(context, item[i], i, item);
                }
        }
        return item;
    };

    /**
        Smashes the properties on the provided arguments into the first argument.
        Any properties on the tail arguments will overwrite
        any existing properties on the first argument.
        
        @param {...any} var_args The tail items to smash.
        @returns {any} A newly smashed item.
        @throws {error} An error is thrown if any of the provided arguments have different underlying types.
    */
    z.smash = function(/* arguments */) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length <= 0) {
            return null;
        }
        if (args.length === 1) {
            return args[0];
        }
        var target = args[0];
        var basis = args[args.length-1];
        z.assert.isSmashable(target, basis);
        var callback = function(value, key, arg) {
            if (!z.check.exists(target[key])) { 
                target[key] = z.deepCopy(args[i][key]);
            }
            else {
                if (z.check.isSmashable(target[key], arg[key])) {
                    z.smash(target[key], arg[key]);
                }
            }
        };
        z.forEach(basis, function(value, key) {
            // smash/copy the basis into the target regardless of key existence
            // this is to ensure that the properties of the final object take priority
            if (z.check.isSmashable(target[key], basis[key])) {
                z.smash(target[key], basis[key]); 
            }
            else {
                target[key] = z.deepCopy(basis[key]);
            }
        });
        for (var i = args.length-2; i >= 1; i--) { // skip the final object on the iteration
            z.assert.isSmashable(args[i], target);
            z.forEach(args[i], callback);
        }
        return target;
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
        "identity": function(x) { return x; }
        , "true": function() { return true; }
        , "false": function() { return false; }
        , "empty": function() { }
        , "matcher": /^(?:[(\s*]*)?(\w+(?:,\s*\w+)*)?(?:[)\s*]*)?=>(?:\s*)?(.*)$/
    };
    z.types = {
        "arguments":            z.getType(arguments) 
        , "array":              z.getType([])
        , "boolean":            z.getType(true)
        , "date":               z.getType(new Date())
        , "generator":          z.getType(function*(){}())
        , "generatorFunction":  z.getType(function*(){})
        , "function":           z.getType(function(){})
        , "null":               z.getType(null)
        , "number":             z.getType(0)
        , "object":             z.getType({})
        , "string":             z.getType("")
        , "regexp":             z.getType(new RegExp())
        , "undefined":          z.getType(undefined)
    };
    z.generators = {
        "empty": function*() { }
    };
    z.symbols = {
        "iterator": "@@iterator" // should be Symbols.iterator eventually -- probably dont need to maintain this list once Symbols exists
    };

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