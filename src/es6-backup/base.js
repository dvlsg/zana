/**
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/

/**
    The main container for all zUtil items.

    @param [object] settings An optional set of settings to define items.
    @param [boolean] settings.useArrayExtensions A boolean flag to determine whether or not to extend Array.prototype.
    @param [boolean] settings.useObjectExtensions A boolean flag to determine whether or not to extend Object.prototype.
    @param [object] settings.defaultLogger An object which defines all of the required logger fields to be used by zUtil.log.
*/
function zUtil(settings) {
    this.setup(settings);
}

(function(undefined) {

    var z = zUtil.prototype;

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
        }
        RecursiveCounter.prototype.pop = function() {
            this.xStack.pop();
            this.yStack.pop();
            this.count--;
        }
        return RecursiveCounter;
    })();

    /**
        Collects the type for a given value.
        
        @param {any} value The value from which to collect the type.
        @returns {string} The type of the value.
    */
    z.getType = function(value) {
        var type = Object.prototype.toString.call(value).match(/^\[object (.+)\]$/)[1];
        if (type === "Function" && value.isGenerator()) {
            return "GeneratorFunction"; // sorta hackish -- find a better way?
        }
        return type;
    };

    /**
        Builds a deep copy of the provided source.
        
        @param {any} origSource The item from which to build the deep copy.
        @returns {any} The copy of the provided source.
        @throws {error} An error is thrown if the recursive object stack grows greater than 1000.
    */
    z.deepCopy = function(origSource) {
        var origIndex = -1;
        var rc = new RecursiveCounter(256);

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

        // function _singleGeneratorCopy(sourceRef) {
        //     origIndex = rc.xStack.indexOf(sourceRef);
        //     if (origIndex === -1) {
        //         rc.push(sourceRef, sourceRef);
        //         return sourceRef;

        //          // this really isn't helpful, since yield isn't expanded until later(?)
        //         var copyRef = function*() {
        //             for (var v of sourceRef) {
        //                 yield _deepCopy(v);
        //             }
        //         };
        //         rc.pop();
        //         return copyRef;
        //     }
        // }

        function _deepCopy(source) {
            if (rc.count > rc.maxStackDepth) throw new Error("Stack depth exceeded: " + rc.stackMaxDepth + "!");
            switch (z.getType(source)) {
                case z.types.object:
                    return _singleCopy(source, Object.create(source));
                case z.types.array:
                    return _singleCopy(source, []);
                case z.types.regexp:
                    return _singleCopy(source, new RegExp(source));
                case z.types.date:
                    return _singleCopy(source, new Date(source.toString()));
                // case z.types.generator:
                // case z.types.generatorFunction:
                    // return _singleCopy(source, Object.create(source));
                    // return _singleGeneratorCopy(source);
                default: // need to handle functions differently? what about generatorfunctions?
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
        var rc = new RecursiveCounter(256);

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
                    if (x.toString() !== y.toString()) {
                        return false; // as close as we can get with anonymous functions
                    }
                    break;
                case z.types.array:
                    // check for extra properties stored on the Array?
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
        Makes a very, very rough estimate 
        of the memory usage of a provided item.
        
        @param {any} o The root item for which to estimate the memory usage.
        @returns {number} The estimated memory usage for the item.
    */
    z.sizeof = function(o) {
        var l = [];     // running object list -- used to avoid counting the same object twice
        var s = [o];    // current object property stack
        var b = 0;      // running byte total

        while (s.length) {
            var v = s.pop();
            if (typeof v === 'boolean') {
                b += 4; // boolean uses 4 bytes
            }
            else if (typeof v === 'string') {
                b += v.length * 2; // each string char uses 2 bytes
            }
            else if ( typeof v === 'number' ) {
                b += 8; // number uses 8 bytes
            }
            else if (typeof v === 'object' && l.indexOf(v) === -1) {
                l.push(v);          // push object to list
                for(i in v) {       // each property in the object
                    s.push(v[i]);   // push each property in the object to the object property stack
                }
            }
        }
        return b;
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
            case z.types.object:
            case z.types.date:
            case z.types.regexp:
                for (var key in item) {
                    if (item.hasOwnProperty(key)) {
                        method.call(context, item[key], key);
                    }
                }
                break;
            case z.types.array:
                for (var i = 0; i < item.length; i++) {
                    method.call(context, item[i], i);
                }
                break;
            case z.types.generator:
                for (var v of item) {
                    method.call(context, v);
                }
                break;
        }
        return item;
    };

    /**
        Smashes the properties on the provided arguments into a single item.
        
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
        var target;
        var sourceType = z.getType(args[0]);
        if (sourceType === z.types.object) {
            target = {};
        }
        else if (sourceType === z.types.array) {
            target = [];
        }
        for (var i = args.length-1; i >= 0; i--) {
            z.assert(function() { return sourceType === z.getType(args[i]); }); // dont allow differing types to be smashed
            z.forEach(args[i], function(value, key) {
                if (!z.check.exists(target[key])) {
                    target[key] = z.deepCopy(args[i][key]);
                }
                else {
                    if (z.check.isSmashable(target[key], args[i][key])) {
                        target[key] = z.smash(target[key], args[i][key]);
                    }
                }
            });
        }
        return target;
    };

    /**
        Executes setup methods based on the provided settings object.
         
        @param {object} settings The settings object.
        @param {boolean} [requestInfo.useArrayExtensions] A boolean flag used to determine whether or not to extend Array.prototype.
        @param {boolean} [requestInfo.useObjectExtensions] A boolean flag used to determine whether or not to extend Object.prototype.
    */
    z.setup = function(settings) {
        settings = settings || {};
        z.setup.initArrays(settings.useArrayExtensions);
        z.setup.initGenerators(settings.useGeneratorExtensions);
        z.setup.initObjects(settings.useObjectExtensions);
        z.setup.initLogger(settings.defaultLogger);
    };

    /**
        Defines constants for the library.
        
        @returns {void}
     */
    (function() {
        z.functions = {
            "identity": x => x
            , "true": x => true
            , "false": x => false
            , "empty": x => {}
        };
        z.generators = {
            "empty": function*() { }
        };
        z.types = {
            "array":                z.getType([])
            , "boolean":            z.getType(true)
            , "date":               z.getType(new Date())
            , "function":           z.getType(function(){})
            , "generator":          z.getType(function*(){}())
            , "generatorFunction":  z.getType(function*(){})
            , "null":               z.getType(null)
            , "number":             z.getType(0)
            , "object":             z.getType({})
            , "string":             z.getType("")
            , "regexp":             z.getType(new RegExp())
            , "undefined":          z.getType(undefined)
        };
        z.symbols = {
            "iterator": "@@iterator" // should be Symbols.iterator eventually -- probably dont need to maintain this list once Symbols exists
        };
    })();

})();