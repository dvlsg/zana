/**
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};

    /**
     * Searches the array for items which either exist, or match a given predicate.
     * 
     * @this {Array}
     * @param {function} [predicate] A predicate used to find matches for the array. This function should return a truthy value.
     * @returns True if at least one item is found which exists or matches the given predicate, else false.
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
     * Collects the type for a given value.
     * 
     * @param {any} value The value from which to collect the type.
     * @returns {string} The type of the value.
     */
    z.getType = function(value) {
        return Object.prototype.toString.call(value).match(/^\[object (.+)\]$/)[1];
    };

    /**
     * Executes an assertion for a given condition.
     * 
     * @param {boolean|function} condition The item used to determine whether or not an assertion passed.
     * @param {string} [message] The overridden message to use when throwing an error. If none is provided, then the condition is used as a message.
     * @returns {void}
     * @throws {error} An error is thrown if the assertion fails.
     */
    z.assert = function(condition, message) {
        var parent = arguments.callee.caller;
        if (z.getType(condition) === z.types.function) {
            if (!condition()) {
                if(message) throw new Error(message);
                else {
                    var functionString = condition.toString();
                    var functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
                    throw new Error("Assertion failed: " + functionBody);
                }
            }
        }
        else if (z.getType(condition) === z.types.string) {
            condition = z.lambda(condition).bind(parent);
            if (!condition()) {
                if(message) throw new Error(message);
                else {
                    var functionString = condition.toString();
                    var functionBody = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim();
                    throw new Error("Assertion failed: " + functionBody);
                }
            }
        }
        else {
            if (!condition) {
                if(message) throw new Error(message);
                else        throw new Error("Assertion failed: " + String(condition));
            } // end if (!condition)
        }
    };

    /**
     * Builds a deep copy of the provided source.
     * 
     * @param {any} origSource The item from which to build the deep copy.
     * @returns {any} The copy of the provided source.
     * @throws {error} An error is thrown if the recursive object stack grows greater than 1000.
     */
    z.deepCopy = function(origSource) {
        var origIndex = -1;
        var rc = new RecursiveCounter(1000);

        function _copyObject(sourceRef, copyRef) {
            origIndex = rc.xStack.indexOf(sourceRef);
            if (origIndex === -1) {
                rc.push(sourceRef, copyRef);
                for (var p in sourceRef) {
                    copyRef[p] = _deepCopy(sourceRef[p]);
                }
                rc.pop();
                return copyRef;
            }
            else {
                return rc.yStack[origIndex];
            }
        }

        function _deepCopy(source) {
            if (rc.count > rc.maxStackDepth) throw new Error("Stack depth exceeded: " + rc.stackMaxDepth + "!");
            switch (z.getType(source)) {
                case 'Object':
                    return _copyObject(source, Object.create(source));
                case 'Array':
                    var copyArray = [];
                    for (var i = 0; i < source.length; i++) {
                        copyArray[i] = _deepCopy(source[i]);
                    }
                    return copyArray;
                   // break;
                case 'RegExp':
                    return _copyObject(source, new RegExp(source));
                case 'Date':
                    return _copyObject(source, new Date(source.toString()));
                default:
                    return source;
            }
        }
        return _deepCopy(origSource);
    };

    /**
     * Compares the equality of two provided items.
     * 
     * @param {any} x The first item to compare.
     * @param {any} y The second item to compare.
     * @returns {boolean} True if the provided values are equal, false if not.
     * @throws {error} An error is thrown if the recursive function stack grows greater than 1000.
     */
    z.equals = function(x, y) {
        var rc = new RecursiveCounter(1000);

        function _compareObject(x, y) {
            var xKeys = Object.keys(x);
            var yKeys = Object.keys(y);
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
            if (rc.xStack.indexOf(x) !== -1) {
                if (rc.yStack.indexOf(y) !== -1) {
                    // console.log("comparison contains a cyclical reference!");
                    // console.log(xStack[xStack.indexOf(x)]);
                    // console.log(yStack[yStack.indexOf(y)]);
                    return true; // assume circular references are equal
                }
            }
            // check for inequalities
            switch(xType) {
                case 'Date':
                    if (x.getTime() !== y.getTime()) {
                        return false;
                    }
                    // check for extra properties stored on the Date object
                    if (!_compareObject(x, y)) {
                        return false;
                    }
                    break;
                case 'Function':
                    if (x.toString() !== y.toString()) {
                        return false; // as close as we can get with anonymous functions
                    }
                    break;
                case 'Array':
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
                case 'Object':
                case 'RegExp':
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
     * Makes a rough estimate of the memory usage of a provided item.
     * 
     * @param {any} o The root item for which to estimate the memory usage.
     * @returns {number} The estimated memory usage for the item.
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
     * Converts a string representation of a 
     * lambda function into a javascript function
     *
     * Note: This is awkward and inefficient, and should absolutely be replaced
     * by arrow functions when ECMAScript 6 is available.
     * 
     * @param {null|function|string} [expression] The string representation of the expression to convert into a function.
     * @returns {function} 
     *      If a string expression is provided, the function for the expression. 
     *      If a function is provided, then return the function.
     *      If expression is null or undefined, return functions.identity.
     */
    z.lambda = function(expression) {
        if (expression == null) {
            return z.functions.identity;
        }
        else if (z.getType(expression) === z.types.function) {
            return expression;
        }
        else if (z.getType(expression) === z.types.string) {
            if (z.equals(expression, "")) {
                return z.functions.identity;
            }
            else if (expression.indexOf("=>") > -1) {
                var match = expression.match(z.functions.matcher);
                var args = match[1] || [];
                var body = match[2];
                return new Function(args, "return " + body + ";").bind(arguments.callee.caller);
            }
            else {
                throw new Error("Error: Expression was not a valid lambda!");
            }
        }
    };

    /**
     * Defines constants for the library.
     * 
     * @returns {void}
     */
    (function() {
        z.functions = {
            "identity": function(x) { return x; }
            , "true": function(x) { return true; }
            , "false": function(x) { return false; }
            , "empty": function(x) { }
            , "matcher": /^(?:[(\s*]*)?(\w+(?:,\s*\w+)*)?(?:[)\s*]*)?=>(?:\s*)?(.*)$/
        };
        z.types = {
            "array":        z.getType([])
            , "boolean":    z.getType(true)
            , "date":       z.getType(new Date())
            , "function":   z.getType(function(){})
            , "null":       z.getType(null)
            , "number":     z.getType(0)
            , "object":     z.getType({})
            , "string":     z.getType("")
            , "regexp":     z.getType(new RegExp())
            , "undefined":  z.getType(undefined)
        };
    })();
    
    w.util = z;
}(window || this));