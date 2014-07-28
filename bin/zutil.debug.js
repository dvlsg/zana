/**
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    /**
        The main container for all zUtil items.

        @param [object] settings An optional set of settings to define items.
        @param [boolean] settings.useArrayExtensions A boolean flag to determine whether or not to extend Array.prototype.
        @param [boolean] settings.useObjectExtensions A boolean flag to determine whether or not to extend Object.prototype.
        @param [object] settings.defaultLogger An object which defines all of the required logger fields to be used by zUtil.log.
    */
    function zUtil(settings) {
        // this.setup(settings);
    }

    // var zu = new zUtil();
    var z = new zUtil(); //zUtil.prototype;

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
            // rebuild the function from the original body and arguments
            var s = source.toString();
            var args = s.substring(s.indexOf("(")+1, s.indexOf(")")).trim().split(",");
            args.map(function(val, index, arr) {
                arr[index] = val.trim();
            });
            var body = s.substring(s.indexOf("{")+1, s.indexOf("}")).trim();
            var anonymous = new Function(args, body); // may need to consider the "this" property
            // make sure we collect any properties which may have been set on the function
            return _singleCopy(source, anonymous);
        }

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
                case z.types.function:
                    return _funcCopy(source);
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
                    if (!z.equals(z.functions.getBody(x), z.functions.getBody(y))) {
                        // function body mismatch
                        return false;
                    }
                    if (!z.equals(z.functions.getArgumentNames(x), z.functions.getArgumentNames(y))) {
                        // function arguments mismatch
                        return false;
                    }
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
        for (var i = 1; i < args.length; i++) {
            z.assert.isSmashable(target, args[i]);
            z.forEach(args[i], function(value, key) {
                if (!z.check.exists(target[key])) {
                    target[key] = args[i][key];
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
            z.forEach(args[i], function(value, key) {
                // bypass based on key existence for all objects other than the basis
                if (!z.check.exists(target[key])) { 
                    target[key] = z.deepCopy(args[i][key]);
                }
                else {
                    if (z.check.isSmashable(target[key], args[i][key])) {
                        z.smash(target[key], args[i][key]);
                    }
                }
            });
        }
        return target;
    };

    /**
        Converts a string representation of a 
        lambda function into a javascript function
    
        Note: This is awkward and inefficient, and should absolutely be replaced
        by arrow functions when ECMAScript 6 is available.
        
        @param {null|function|string} [expression] The string representation of the expression to convert into a function.
        @returns {function} 
             If a string expression is provided, the function for the expression. 
             If a function is provided, then return the function.
             If expression is null or undefined, return functions.identity.
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
        }
        // throw error or assume equality check? 
        // see unitTests.removeAll for methods using the default equals
        return function(x) { return z.equals(expression, x); }; 
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
        , "true": function(x) { return true; }
        , "false": function(x) { return false; }
        , "empty": function(x) { }
        , "matcher": /^(?:[(\s*]*)?(\w+(?:,\s*\w+)*)?(?:[)\s*]*)?=>(?:\s*)?(.*)$/
    };
    z.types = {
        "arguments":    z.getType(arguments) 
        , "array":      z.getType([])
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

    return (function() {
        var root,
            freeModule,
            freeExports,
            freeGlobal,
            moduleExports,
            freeDefine;

        root = (
            typeof window !== 'undefined' ?
                window
                : typeof global !== 'undefined' ?
                    global 
                    : this
        );

        if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
            // freeDefine = define;
            // define.amd exists
            // expose to root and call define
            root.z = z;
            define(function() {
                return z;
            });
        }
        else if (typeof module !== 'undefined') {
            _module = module;
            if (typeof module.exports !== 'undefined') {
                // module.exports exists
                _module.exports = z;
            }
            else {
                // module exists, but module.exports does not -- what to do??
            }
        }
        else {
            // assume browser, expose to root
            root.z = z;
        }

        return z;

    })();

})();/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        var arrays = z.arrays = {};

        /**
            Performs the provided method on each element of array,
            using the previous result and the current item as
            arguments for the method.
            
            Note that we could really just use Array.prototype.reduce -- same thing.
            
            @this {array}
            @param {array} source The original array.
            @param {function} func A function used to return the result of an operation on the current element and previous result.
            @param {function} [seed] An optional seed to use as the the first argument with the first item in the array.
            @returns The result of the aggregate function on the array.
        */
        arrays.aggregate = function(/* source, func, seed */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var func = arguments[argsIterator++];
            var seed = arguments[argsIterator++];
            z.assert.isNonEmptyArray(source);
            var result;
            func = z.lambda(func);
            if (seed == null) {
                result = source[0];
            }
            else {
                result = func(seed, source[0]);
            }
            for (var i = 1; i < source.length; i++) {
                result = func(result, source[i]);
            }
            return result;
        };

        /**
            Searches the array for at least one item 
            which either exists, or matches a given predicate.
            
            @this {Array}
            @param {array} source The original array.
            @param {function} [predicate] A predicate used to find matches for the array. This function should return a truthy value.
            @returns True if at least one item is found which exists or matches the given predicate, else false.
        */
        arrays.any = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (predicate == null) {
                return source.length > 0;
            }
            predicate = z.lambda(predicate);
            for (var i = 0; i < source.length; i++) {
                if (predicate(source[i])) {
                    return true;
                }    
            }
            return false;
        };

        /**
            Collects the average of an array of numbers or a given numeric property for an array of objects.
            
            @this {Array}
            @param {string} [selector] A property name.
            @returns The average of either the array itself, or the given property.
        */
        arrays.average = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            return arrays.sum(source, selector) / source.length;
        };

        /**
            Searches the array for items for a match for a given item.
            
            @this {Array}
            @param {any} item The item for which to search. or the predicate to use for matching.
            @param {function} [selector] The optional selector function used to select an item from the array for matching.
            @returns True if the item is found, else false.
        */
        arrays.contains = function(/* source, item, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var item = arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var comparer;
            if (z.check.isFunction(item)) 
                comparer = function(x) { return item(x); };
            else
                comparer = function(x, y) { return z.equals(x, y); };

            if (selector == null) {
                for (var i = 0; i < source.length; i++) {
                    if (comparer(source[i], item)) {
                        return true;
                    }
                }
            }
            else {
                selector = z.lambda(selector);
                for (var i = 0; i < source.length; i++) {
                    if (comparer(selector(source[i]), item)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
            Searches the array for items for matches for a given item.
            
            @this {Array}
            @param {any} item The item for which to search.
            @param {function} [selector] The optional selector function used to select an item from the array for matching.
            @returns The count of the matches found.
        */
        arrays.count = function(/* source, item, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var item = arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var count = 0;
            var comparer;
            if (z.check.isFunction(item)) 
                comparer = function(x) { return item(x); };
            else
                comparer = function(x, y) { return z.equals(x, y); };

            if (selector == null) {
                for (var i = 0; i < source.length; i++) {
                    if (comparer(source[i], item)) {
                        count++;
                    }
                } 
            }
            else {
                selector = z.lambda(selector);
                for (var i = 0; i < source.length; i++) {
                    if (comparer(selector(source[i]), item)) {
                        count++;
                    }
                }
            }
            return count;
        };

        /**
            Builds a deep copy of the original array.
            To be used for the Array.prototype extension.

            @this {array} The array from which to build the deep copy.
            @returns {any} A deep copy of the original array.
            @throws {error} An error is thrown if the recursive object stack grows greater than 1000.
        */
        var _deepCopy = function() {
            return z.deepCopy(this);
        };

        /**
            Builds a compressed array from the original, containing only distinct items.
            If a selector is given, then uniqueness will be determined by 
            comparing the selected properties from objects on the array.
            
            @this {array}
            @param {string} [selector] A property name.
            @returns {array} A deep copied, distinct set of items.
        */
        arrays.distinct = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var result = [];
            if (selector == null) {
                for (var i = 0; i < source.length; i++) {
                    if (!result.contains(source[i])) {
                        result.push(source[i]);
                    }
                }
            }
            else {
                selector = z.lambda(selector);
                var keys = [];
                for (var i = 0; i < source.length; i++) {
                    if (!result.contains(selector(source[i]), selector)) {
                        result.push(source[i]);
                    }
                }
            }
            return result;
        };

        /**
            Compares the equality of the original and a provided array.
            To be used for the Array.prototype extension.

            @this {array} The first array to compare.
            @param {array} arr2 The second array to compare.
            @returns {boolean} True if both arrays contain equal items, false if not.
            @throws {error} An error is thrown if the recursive function stack grows greater than 1000.
        */
        var _equals = function(arr2) {
            return z.equals(this, arr2);
        };

        /**
            Collects the first available value on the array
            optionally based on a given predicate. 
            
            @this {array} The array on which to search for a max value.
            @param {function} [predicate] The optional predicate used to find the first match.
            @returns {any} If no predicate is available, then the first item. If the predicate is available, the first item which matches.
        */
        arrays.first = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            var source = this;
            if (predicate == null) {
                if (source.length > 0) {
                    return source[0];
                }
            }
            else {
                predicate = z.lambda(predicate);
                for (var i = 0; i < source.length; i++) {
                    if (predicate(source[i])) {
                        return source[i];
                    }
                }
            }
            return null;
        };

        /**
            Sets up two arrays of objects to be joined together.
            
            @this {array.<object>} The initial left array used for the inner join
            @param {array.<object>} [rightArray] The secondary right array used for the inner join.
            @returns {function} Returns an object containing the on method to be called after original inner join setup.
        */
        arrays.innerJoin = function(/* leftArray, rightArray */) {
            var argsIterator = 0;
            var leftArray = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var rightArray = arguments[argsIterator++];
            // z.check.isNonEmptyArray(rightArray);
            return {
                /**
                    Joins two arrays of objects together based on a provided predicate.

                    @param {function} predicate The predicate used to find matches between the left and right arrays.
                    @returns {array.<object>} The inner joined collection of left and right arrays.
                */
                on: function(predicate) {
                    var target = [];
                    predicate = z.lambda(predicate);
                    for (var i = 0; i < leftArray.length; i++) {
                        z.check.isObject(leftArray[i]);
                        for (var k = 0; k < rightArray.length; k++) {
                            z.check.isObject(rightArray[k]);
                            if (predicate(leftArray[i], rightArray[k])) {
                                target.push(z.smash({}, leftArray[i], rightArray[k]));
                            }
                        }
                    }
                    return target;
                }
            };
        };

        /**
            Checks to see if an array is empty.
            
            @param {array} source The array to check for emptiness.
            @returns {boolean} True if the array contains no elements, or a combination of undefined or null elements, false if not.
        */
        arrays.isEmpty = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            if (source.length < 1) {
                return true;
            }
            for (var i = 0; i < source.length; i++) {
                if (z.check.exists(source[i])) {
                    return false;
                }
            }
            return true;
        };

        /**
            Checks to see if an array is full.
            
            @param {array} source The array to check for emptiness.
            @returns {boolean} True if the array contains no elements, or a combination of undefined or null elements, false if not.
        */
        arrays.isFull = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            if (source.length < 1) {
                return false;
            }
            for (var i = 0; i < source.length; i++) {
                if (!z.check.exists(source[i])) {
                    return false;
                }
            }
            return true;
        };

        /**
            Collects the last available value on the array
            optionally based on a given predicate. 
            
            @this {array} The array on which to search for a max value.
            @param {function} [predicate] The optional predicate used to find the last match.
            @returns {any} If no predicate is available, then the last item. If the predicate is available, the last item which matches.
        */
        arrays.last = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (predicate == null) {
                if (source.length > 0) {
                    return source[source.length-1];
                }
            }
            else {
                predicate = z.lambda(predicate);
                for (var i = source.length-1; 0 <= i; i--) {
                    if (predicate(source[i])) {
                        return source[i];
                    }
                }
            }
            return null;
        };

        /**
            Collects the maximum value of an array of numbers 
            or a given numeric property for an array of objects.
            
            @this {array} The array on which to search for a max value.
            @param {string} [selector] A property name.
            @returns The maximum value of either the array itself, or the given property.
        */
        arrays.max = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var maxValue = Number.MIN_VALUE;
            if (selector != null) {
                selector = z.lambda(selector);
                for (var i = 0; i < source.length; i++) {
                    var selected = selector(source[i]);
                    if (z.check.isNumber(selected) && maxValue < selected) {
                        maxValue = selected;
                    }
                }
            }
            else {
                for (var i = 0; i < source.length; i++) {
                    var selected = source[i];
                    if (z.check.isNumber(selected) && maxValue < selected) {
                        maxValue = selected;
                    }
                }
            }
            return maxValue;
        };

        /**
            Collects the minimum value of an array of numbers 
            or a given numeric property for an array of objects.
            
            @param {array} source The source array from which to collect min value.
            @param {function} [selector] A selector function.
            @returns The minimum value of either the array itself, or the given property.
        */
        arrays.min = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var minValue = Number.MAX_VALUE;
            if (selector != null) {
                selector = z.lambda(selector);
                for (var i = 0; i < source.length; i++) {
                    var selected = selector(source[i]);
                    if (z.check.isNumber(selected) && selected < minValue) {
                        minValue = selected;
                    }
                }
            }
            else {
                for (var i = 0; i < source.length; i++) {
                    var selected = source[i];
                    if (z.check.isNumber(selected) && selected < minValue) {
                        minValue = selected;
                    }
                }
            }
            return minValue;
        };

        /**
            Mutates the provided array based on a given mutator function.
            Each item of the array will be passed through the mutator function,
            setting the return from the mutator back to the original array index.
            
            @param {array} source The source array from which to collect min value.
            @param {function} mutator The mutator function.
            @returns A reference to the original (now mutated) array.
        */
        arrays.mutate = function(/* source, mutator */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var mutator = arguments[argsIterator++];
            mutator = z.lambda(mutator);
            if (z.check.isFunction(mutator)) {
                z.forEach(source, function(val, key) {
                    source[key] = mutator(source[key]);
                });
            }
            return source;
        };

        /**
            Creates an deep copy of the original array of objects, ordered by the given key. 
            
            @this {Object[]}
            @param {function|string} selector The method or lambda string used to select a key by which to order.
            @param {function} [predicate] A predicate used to determine whether one object is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
        */
        arrays.orderBy = function(/* source, selector, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            selector = z.lambda(selector);
            predicate = predicate || function(x, y) {
                return ((selector(x) > selector(y)) ? 1 : (selector(x) < selector(y)) ? -1 : 0);
            }
            var containsKey = source.where(function(obj) { return selector(obj) != null; });
            var missingKey = source.where(function(obj) { return selector(obj) == null; }); // don't bother sorting items with null or undefined keys
            containsKey.quicksort(predicate); 
            return containsKey.concat(missingKey);
        };

        /**
            Sorts the original, given array in place by using the quicksort algorithm.
            
            @this {Array}
            @param {string|function} [predicate] A predicate used to determine whether one item is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
        */
        arrays.quicksort = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (z.getType(predicate) === z.types.string) {
                predicate = z.lambda(predicate);
            }
            else {
                // dont accidentally take z.functions.identity - use this else statement
                predicate = predicate || function(x, y) {
                    return (x > y) ? 1 : ((x < y) ? -1 : 0);
                }
            }
            var internalQuickSort = function(left, right) {
                do {
                    var i = left;
                    var j = right;
                    var pivot = source[Math.floor((left + right) / 2)];
                    do {
                        while ((i < source.length) && (predicate(source[i], pivot) < 0)) {
                            i++;
                        }
                        while ((0 <= j) && (predicate(pivot, source[j]) < 0)) {
                            j--;
                        }
                        if (i > j) {
                            break; // left index has crossed right index, stop the loop
                        }
                        if (i < j) {
                            source.swap(i, j); // swap the indexes in the source
                        }
                        i++;
                        j--;
                    } while (i <= j);
                    if ((j - left) <= (right - i)) {
                        if (left < j) {
                            internalQuickSort(left, j);
                        }
                        left = i;
                    }
                    else {
                        if (i < right) {
                            internalQuickSort(i, right);
                        }
                        right = j;
                    }
                } while (left < right);
            }
            internalQuickSort(0, this.length-1);
        };

        /**
            Sorts the original, given array in place 
            by using the quicksort algorithm with three-way partitioning.
            
            @this {Array}
            @param {string|function} [predicate] A predicate used to determine whether one item is greater than, less than, or equal to another. If no predicate is defined, then the javascript > and < comparators are used.
        */
        arrays.quicksort3 = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            if (z.getType(predicate) === z.types.string) {
                predicate = z.lambda(predicate);
            }
            else {
                // dont accidentally take z.functions.identity - use this else statement
                predicate = predicate || function(x, y) {
                    return (x > y) ? 1 : ((x < y) ? -1 : 0);
                }
            }
            var internalQuickSort = function(left, right) {
                var indexForLessThan = left;
                var indexForGreaterThan = right;
                var pivot = source[left];
                var indexForIterator = left+1;
                while (indexForIterator <= indexForGreaterThan) {
                    var cmp = predicate(source[indexForIterator], pivot);
                    if (cmp < 0) {
                        source.swap(indexForLessThan++, indexForIterator++);
                    }
                    else if (cmp > 0) {
                        source.swap(indexForIterator, indexForGreaterThan--);
                    }
                    else {
                        indexForIterator++;
                    }
                }
                if (left < indexForLessThan-1) {
                    internalQuickSort(left, indexForLessThan-1);
                }
                if (indexForGreaterThan+1 < right) {
                    internalQuickSort(indexForGreaterThan+1, right);
                }
            }
            internalQuickSort(0, this.length-1);
        };

        /**
            Removes elements from an array based on a provided predicate.
            Traverses the array backwards, as it modifies the array which is currently being iterated.
             
            @this {array}
            @param {function|string} selector The method or lambda string used to determine element removal.
            @returns {void}
        */
        arrays.removeAll = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var removalCount = 0;
            selector = z.lambda(selector);
            for (var i = source.length-1; i > -1; i--) {
                if (selector(source[i])) {
                    source.splice(i, 1);
                    removalCount++;
                }
            }
            return removalCount;
        };

        /**
            Projects a selected set of elements from an array of objects into a new array of new objects.
            
            @this {array}
            @param {(string|function|string[])} selectors A property name, function for selecting properties, or an array of property names.
            @returns {array} An array of objects, containing the properties specified by selectors.
        */
        arrays.select = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var result = [];
            selector = z.lambda(selector);
            for (var i = 0; i < source.length; i++) {
                result.push(selector(source[i]));
            }
            return result;
        };

        /**
            Takes and returns the items of the array
            starting at the provided index.
            
            @this {array}
            @param {number} index The index to start at.
            @returns {array} An array containing the taken items.
        */
        arrays.skip = function(/* source, index */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var index = arguments[argsIterator++];
            var result = [];
            if (index < 0) {
                index = 0; // consider logic for negative skips skipping items from the back
            }
            for (var i = 0; i < source.length - index && index <= source.length; i++) {
                result[i] = source[i+index];
            }
            return result;
        };

        /**
            Builds a summation of an array of numbers
            or a given numeric property for an array of objects.
            
            @this {array}
            @param {function|string} [selector] The method or lambda string used to select a property name for an array of objects.
            @returns A summation of either the array itself, or the given property.
        */
        arrays.sum = function(/* source, selector */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var selector = arguments[argsIterator++];
            var sum = 0;
            if (selector != null) {
                selector = z.lambda(selector);
                for (var i = 0; i < source.length; i++) {
                    var selection = selector(source[i]);
                    if (z.check.isNumber(selection)) {
                        sum += selection;
                    }
                }
            }
            else {
                for (var i = 0; i < source.length; i++) {
                    if (z.check.isNumber(source[i])) {
                        sum += (source[i]);
                    }
                }
            }
            return sum;
        };

        /**
            Swaps two array items located at the provided indices.
            Note that the assertions can be dropped to improve performance.
            
            @this {array}
            @param {number} indexA The first index.
            @param {number} indexB The second index.
            @returns {void}
         */
        arrays.swap = function(/* source, indexA, indexB */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var indexA = arguments[argsIterator++];
            var indexB = arguments[argsIterator++];
            var temp = source[indexA];
            source[indexA] = source[indexB];
            source[indexB] = temp;
        };

        /**
            Takes the number of provided items from the array,
            starting at the first element.
            
            @this {array}
            @param {number} count The number of items to take.
            @returns {array} An array containing the taken items.
        */
        arrays.take = function(/* source, count */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var count = arguments[argsIterator++];
            var result = [];
            if (count < 0) {
                count = 0; // consider logic to allow negative count to count from the back of the array
            }
            for (var i = 0; i < count && i < source.length; i++) {
                result[i] = source[i];
            }
            return result;
        };

        /**
            Takes items from the array until
            the predicate no longer matches.
            
            @this {array}
            @param {function|string} predicate The method or lambda string used to determine when to halt collection from the source array.
            @returns {array} An array containing the taken items.
        */
        arrays.takeWhile = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            var result = [];
            predicate = z.lambda(predicate);
            for (var i = 0; i < count; i++) {
                if (!predicate(source[i])) break;
                result.push(source[i]);
            }
            return result;
        };

        /**
            Builds an array of objects from the original array which
            contains items that meet the conditions given by the predicate.

            Note that this is really the same thing as Array.filter.
            
            @this {array}
            @param {function} predicate A predicate used to determine whether or not to take an object on the array.
            @returns {array} A deep copied array of objects which match the predicate.
        */
        arrays.where = function(/* source, predicate */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var predicate = arguments[argsIterator++];
            predicate = z.lambda(predicate);
            var source = this;
            var result = [];
            for (var i = 0; i < source.length; i++) {
                if (predicate(source[i])) {
                    result.push(source[i]);
                }
            }
            return result;
        };

        /**
            Builds a new array by executing a provided method 
            with the provided two arrays and placing the result the new array.
            
            @param {arr1} array The first array to use for the zipping method.
            @param {arr2} array The second array to use for the zipping method.
            @param {method} method The method used to execute and return a result using items on both of the original arrays.
            @returns {array} An array with the zipped results.
        */
        arrays.zip = function(/* arr1, arr2, method */) {
            var argsIterator = 0;
            var arr1 = z.getType(this) === z.types.array ? this : arguments[argsIterator++];
            var arr2 = arguments[argsIterator++];
            var method = arguments[argsIterator++];
            method = z.lambda(method);
            var source = this;
            var result = [];
            for (var i = 0; i < source.length; i++) {
                result.push(method(arr1[i], arr2[i]));
            }
            return result;
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the Array.prototype.
            
            @returns {void}
        */
        z.setup.initArrays = function(usePrototype) {
            if (!!usePrototype) {
                z.defineProperty(Array.prototype, "aggregate", { enumerable: false, writable: false, value: arrays.aggregate });
                z.defineProperty(Array.prototype, "any", { enumerable: false, writable: false, value: arrays.any });
                z.defineProperty(Array.prototype, "average", { enumerable: false, writable: false, value: arrays.average });
                z.defineProperty(Array.prototype, "contains", { enumerable: false, writable: false, value: arrays.contains });
                z.defineProperty(Array.prototype, "count", { enumerable: false, writable: false, value: arrays.count });
                z.defineProperty(Array.prototype, "deepCopy", { enumerable: false, writable: false, value: _deepCopy });
                z.defineProperty(Array.prototype, "distinct", { enumerable: false, writable: false, value: arrays.distinct });
                z.defineProperty(Array.prototype, "equals", { enumerable: false, writable: false, value: _equals });
                z.defineProperty(Array.prototype, "first", { enumerable: false, writable: false, value: arrays.first });
                z.defineProperty(Array.prototype, "innerJoin", { enumerable: false, writable: false, value: arrays.innerJoin });
                z.defineProperty(Array.prototype, "isEmpty", { enumerable: false, writable: false, value: arrays.isEmpty });
                z.defineProperty(Array.prototype, "isFull", { enumerable: false, writable: false, value: arrays.isFull });
                z.defineProperty(Array.prototype, "last", { enumerable: false, writable: false, value: arrays.last });
                z.defineProperty(Array.prototype, "max", { enumerable: false, writable: false, value: arrays.max });
                z.defineProperty(Array.prototype, "min", { enumerable: false, writable: false, value: arrays.min });
                z.defineProperty(Array.prototype, "mutate", { enumerable: false, writable: false, value: arrays.mutate });
                z.defineProperty(Array.prototype, "orderBy", { enumerable: false, writable: false, value: arrays.orderBy });
                z.defineProperty(Array.prototype, "quicksort", { enumerable: false, writable: false, value: arrays.quicksort });
                z.defineProperty(Array.prototype, "quicksort3", { enumerable: false, writable: false, value: arrays.quicksort3 });
                z.defineProperty(Array.prototype, "removeAll", { enumerable: false, writable: false, value: arrays.removeAll });
                z.defineProperty(Array.prototype, "select", { enumerable: false, writable: false, value: arrays.select });
                z.defineProperty(Array.prototype, "skip", { enumerable: false, writable: false, value: arrays.skip });
                z.defineProperty(Array.prototype, "sum", { enumerable: false, writable: false, value: arrays.sum });
                z.defineProperty(Array.prototype, "swap", { enumerable: false, writable: false, value: arrays.swap });
                z.defineProperty(Array.prototype, "take", { enumerable: false, writable: false, value: arrays.take });
                z.defineProperty(Array.prototype, "takeWhile", { enumerable: false, writable: false, value: arrays.takeWhile });
                z.defineProperty(Array.prototype, "where", { enumerable: false, writable: false, value: arrays.where });
                z.defineProperty(Array.prototype, "zip", { enumerable: false, writable: false, value: arrays.zip });
            }
        };
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(undefined) {

    function factory(z) {

        z.classes = z.classes || {};

        /**
            Executes an assertion for a given condition.
            
            @param {boolean|function} condition The item used to determine whether or not an assertion passed.
            @param {string} [message] The overridden message to use when throwing an error. If none is provided, then the condition is used as a message.
            @returns {void}
            @throws {error} An error is thrown if the assertion fails.
        */
        var assert = function(condition, message) {
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
            Asserts that all of the arguments provided for a method existing.
            
            @param {string} var_args The arguments provided to a method.
            @returns {boolean} True, if the assertion passes.
        */
        var argsNotNull = function() {
            assert(function() { return z.check.argsNotNull.apply(this, arguments); });
        };

        /**
            Asserts that the provided value is not equal to null or undefined.
            
            @param {any} value The value to check for null or undefined values.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the value is equal to null or undefined.
        */
        var exists = function(value) {
            assert(function() { return z.check.exists(value); });
        };

        /**
            Asserts that the provided value is an array type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isArray = function(value) {
            assert(function() { return z.check.isArray(value); });
        };

        /**
            Asserts that the provided value is a boolean type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isBoolean = function(value) {
            assert(function() { return z.check.isBoolean(value); });
        };

        /**
            Asserts that the provided value is a date type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isDate = function(value) {
            assert(function() { return z.check.isDate(value); });
        };

        /**
            Asserts that the provided value is a function type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isFunction = function(value) {
            assert(function() { return z.check.isFunction(value); });
        };

        /**
            Asserts that the provided value is a non-empty array.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isNonEmptyArray = function(value) {
            assert(function() { return z.check.isNonEmptyArray(value); });
        };

        /**
            Asserts that the provided value is a number type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isNumber = function(value) {
            assert(function() { return z.check.isNumber(value); });
        };

        /**
            Asserts that the provided value is an object type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isObject = function(value) {
            assert(function() { return z.check.isObject(value); });
        };

        /**
            Asserts that the provided value is a reference type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isReference = function(value) {
            assert(function() { return z.check.isReference(value); });
        };

        /**
            Asserts that the provided arguments are all 
            the same type of either arrays, functions, or objects.
            
            @param {...array|object|function} var_args The items to check for smashability.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isSmashable = function(/* ... arguments */) {
            var args = arguments; // keep a pointer, so we can pass them into the anonymous function
            assert(function() { return z.check.isSmashable.apply(undefined, args); });
        };

        /**
            Asserts that the provided value is a string type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True if the value is a string, false if not.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isString = function(value) {
            assert(function() { return z.check.isString(value); });
        };

        /**
            Asserts that the provided value is a provided type.
            
            @param {any} value The value on which to check the assertion.
            @param {string} type The name of the type for which to check.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isType = function(value, type) {
            assert(function() { return z.check.isType(value, type); });
        };

        /**
            Asserts that the provided value is a value (non-reference) type.
            
            @param {any} value The value on which to check the assertion.
            @returns {boolean} True, if the assertion passes.
            @throws {error} An error is thrown if the assertion fails.
        */
        var isValue = function(value) {
            assert(function() { return z.check.isValue(value); });
        };


        /**
            A wrapper class used to hold and execute different assertion methods.

            @class Contains a provided set of assertions.
         */
        var Asserter = (function() {

            /**
                Creates a new Asserter class.

                @constructor
                @param {object} logger The interface containing the expected log methods.
                @param {bool} [enableDebugLogging] An override for enabling debug logging on Log class creation.
            */
            function Asserter() {

                /**
                    Extends a function into an Asserter interface with
                    the pre-determined, privately stored properties,
                    returning it back to the original Asserter() call.

                    @returns {function} The extended function.
                */
                return (function(newAsserter) {
                    /**
                        The base Asserter function to be returned.
                        Note that the base function can be called
                        as a pass-through method for _assert without
                        needing to directly call LogInterface.log()

                        @param {any} [x] The item to extend and return to the Asserter class.
                        @returns {any} The extended item.
                    */
                    z.defineProperty(newAsserter, "argsNotNull", { get: function() { return argsNotNull; }, writeable: false });
                    z.defineProperty(newAsserter, "exists", { get: function() { return exists; }, writeable: false });
                    z.defineProperty(newAsserter, "isArray", { get: function() { return isArray; }, writeable: false });
                    z.defineProperty(newAsserter, "isBoolean", { get: function() { return isBoolean; }, writeable: false });
                    z.defineProperty(newAsserter, "isDate", { get: function() { return isDate; }, writeable: false });
                    z.defineProperty(newAsserter, "isFunction", { get: function() { return isFunction; }, writeable: false });
                    z.defineProperty(newAsserter, "isNonEmptyArray", { get: function() { return isNonEmptyArray; }, writeable: false });
                    z.defineProperty(newAsserter, "isNumber", { get: function() { return isNumber; }, writeable: false });
                    z.defineProperty(newAsserter, "isObject", { get: function() { return isObject; }, writeable: false });
                    z.defineProperty(newAsserter, "isReference", { get: function() { return isReference; }, writeable: false });
                    z.defineProperty(newAsserter, "isSmashable", { get: function() { return isSmashable; }, writeable: false });
                    z.defineProperty(newAsserter, "isString", { get: function() { return isString; }, writeable: false });
                    z.defineProperty(newAsserter, "isType", { get: function() { return isType; }, writeable: false });
                    z.defineProperty(newAsserter, "isValue", { get: function() { return isValue; }, writeable: false });
                    return newAsserter;
                })(assert);
            }

            return Asserter;
            
        })();

        z.classes.Asserter = Asserter;
        z.assert = new z.classes.Asserter(); // add a default Log using the console as the logging interface
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {
        
        z.classes = z.classes || {};
        var slice = Array.prototype.slice;

        /**
            TBD

            @class TBD
        */
        var Cache = (function() {

            /**
                TBD
            */
            function Cache(options) {

                var _timeout, 
                    _lru,
                    _mru,
                    _length,
                    _cache;

                var accessor = function(key, value) {
                    z.assert.exists(key);
                    if (z.check.exists(value)) {
                        return set(key, value);
                    }
                    else {
                        return get(key);
                    }
                };

                var get = function(key) {
                    var obj = _cache[key];
                    if (z.check.exists(obj)) {
                        return _cache[key].data;
                    }
                    return null;
                };

                var peek = function(key) {
                    return _cache[key].data;
                };

                var set = function(key, value) {
                    _cache[key] = {
                        data: value,
                        args: null,
                        getter: null,
                        timestamp: new Date().getTime()
                    };
                    return _cache[key].data;
                };

                var set_refresh = function(key, getter) {
                    z.log("updating the cache with getter method...");
                    z.assert.isFunction(getter);
                    var args = Array.prototype.slice.call(arguments, 2);
                    var data = getter.apply(null, args);
                    _cache[key] = {
                        data: data,
                        args: args, // make a deep copy of args?
                        getter: getter,
                        timestamp: new Date().getTime()
                    };
                    return _cache[key].data;
                }

                var reset = function(opts) {
                    _cache = {};
                    _timeout = opts.timeout;
                    _lru = 0;
                    _mru = 0;
                    _length = 0;
                };
                reset(options);

                /**
                    @returns {function} The extended function.
                */
                return (function(cache) {
                    z.defineProperty(cache, "peek", { get: function() { return peek; }, writeable: false });
                    z.defineProperty(cache, "reset", { get: function() { return reset; }, writeable: false });
                    return cache;
                })(accessor);
            }

            return Cache;
            
        })();

        z.classes.Cache = Cache;
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        /**
            Container for all utility checking methods.
            
            @class Contains all utility checking methods.
        */
        var check = function() {};

        /**
            Checks that all of the arguments provided for a method existing.
            
            @param {string} var_args The arguments provided to a method.
            @returns {boolean} True, if the check passes.
        */
        check.argsNotNull = function() {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == null) {
                    return false;
                }
            }
            return true;
        };

        /**
            Checks that the provided value is not equal to null or undefined.
            
            @param {any} value The value to check for null or undefined values.
            @returns {boolean} True, if the check passes.
            @throws {error} An error is thrown if the value is equal to null or undefined.
        */
        check.exists = function(value) {
            return value != null;
        };

        /**
            Checks that the provided value is an array type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isArray = function(value) {
            return z.getType(value) === z.types.array;
        };

        /**
            Checks that the provided value is a boolean type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isBoolean = function(value) {
            return z.getType(value) === z.types.boolean;
        };

        /**
            Checks that the provided value is a date type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isDate = function(value) {
            return z.getType(value) === z.types.date;
        };

        /**
            Checks that the provided value is a function type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isFunction = function(value) {
            return z.getType(value) === z.types.function;
        };

        /**
            Checks that the provided value is a generator function type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isGeneratorFunction = function(value) {
            return z.getType(value) === z.types.function && value.isGenerator();
        };

        /**
            Checks that the provided value is an iterable type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isIterable = function(value) {
            if (!z.check.exists(value)) return false;
            var iterator = value[z.symbols.iterator] || value.prototype[z.symbols.iterator]; // will this always be on prototype?
            return z.getType(iterator) === z.types.function;
        };

        /**
            Checks that the provided value is a non-empty array.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isNonEmptyArray = function(value) {
            return (z.check.exists(value) && z.getType(value) === z.types.array && value.length > 0);
        };

        /**
            Checks that the provided value is a number type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isNumber = function(value) {
            return !isNaN(value); 
        };

        /**
            Checks that the provided value is an object type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isObject = function(value) {
            return z.getType(value) === z.types.object;
        };

        /**
            Checks that the provided value is a reference type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isReference = function(value) {
            switch (z.getType(value)) {
                case z.types.array:
                case z.types.date:
                case z.types.function:
                case z.types.generator:
                case z.types.generatorFunction:
                case z.types.object:
                case z.types.regexp:
                    return true;
                default:
                    return false;
            }
        };

        /**
            Checks that the provided arguments are all 
            the same type of either arrays, functions, or objects.
            
            @param {...array|object|function} var_args The items to check for smashability.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isSmashable = function(/* ... arguments */) {
            var args = Array.prototype.slice.call(arguments);

            if (args.length < 1)
                return false;
     
            var baseType = z.getType(args[0]);
            if (!(baseType === z.types.array || baseType === z.types.object || baseType === z.types.function))
                return false;

            if (baseType === z.types.function)
                baseType = z.types.object; // allow functions to be smashed onto objects, and vice versa

            for (var i = 1; i < args.length; i++) {
                var targetType = z.getType(args[i]);
                if (targetType === z.types.function)
                    targetType = z.types.object; // allow functions to be smashed onto objects, and vice versa

                if (targetType !== baseType)
                    return false;
            }
            return true;
        };

        /**
            Checks that the provided value is a string type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isString = function(value) {
            return z.getType(value) === z.types.string;
        };

        /**
            Checks that the provided value is a provided type.
            
            @param {any} value The value on which to check.
            @param {string} type The name of the type for which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isType = function(value, type) {
            return z.getType(value) === type;
        };

        /**
            Checks that the provided value is a value (non-reference) type.
            
            @param {any} value The value on which to check.
            @returns {boolean} True if the check passes, false if not.
        */
        check.isValue = function(value) {
            switch (z.getType(value)) {
                case z.types.boolean:
                case z.types.null: // value or reference?
                case z.types.number:
                case z.types.string:
                case z.types.undefined: // value or reference?
                    return true;
                default:
                    return false;
            }
        };

        z.check = check;
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }
    
}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        z.classes = z.classes || {};

        /**
            Executes a conversion for a given source and type.
            
            @param {any} source The item to convert.
            @param {string} toType The type to which to convert.
            @returns {any} The converted source.
            @throws {error} An error is thrown if toType is not a string.
        */
        var convert = function(source, toType) {
            z.assert.isString(toType);
            switch (toType) {
                case z.types.boolean: return toBoolean(source);
                case z.types.date: return toDate(source);
                case z.types.number: return toNumber(source);
            }
        };

        /**
            Executes a conversion to boolean for a given source.
            
            @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        var toBoolean = function(source) {
            if (z.check.exists(source) && z.check.isFunction(source.toBoolean)) {
                return source.toBoolean(); // allow override to be supplied directly on the source object
            }
            switch (z.getType(source)) {
                case z.types.boolean:
                    return source;
                case z.types.string:
                    switch (source.toLowerCase().trim()) {
                        case "false":
                        case "0":
                        case "":
                        case null:
                        case undefined:
                            return false;
                        default:
                            return true;
                    }
                default:
                    return !!source;
            }
        };

        /**
            Executes a conversion to a date for a given source.
            
            @param {any} source The item to convert.
            @returns {date} The converted source.
        */
        var toDate = function(source) {
            if (z.check.exists(source) && z.check.isFunction(source.toDate)) {
                return source.toDate();
            }
            switch (z.getType(source)) {
                case z.types.date:
                    return source;
                case z.types.string:
                    return new Date(Date.parse(source));
                default:
                    return new Date(Date.parse(source.toString()));
            }
        };

        /**
            Executes a conversion to a number for a given source.
            
            @param {any} source The item to convert.
            @returns {boolean} The converted source.
        */
        var toNumber = function(source) {
            if (z.check.exists(source) && z.check.isFunction(source.toNumber)) {
                return source.toNumber(); // allow override to be supplied directly on the source object
            }
            switch (z.getType(source)) {
                case z.types.number:
                    return source;
                default:
                    return +source;
            }
        };

        /**
            A wrapper class used to hold and execute different assertion methods.

            @class Contains a provided set of assertions.
         */
        var Converter = (function() {

            /**
                Creates a new Asserter class.

                @constructor
                @param {object} logger The interface containing the expected log methods.
                @param {bool} [enableDebugLogging] An override for enabling debug logging on Log class creation.
            */
            function Converter() {

                /**
                    Extends a function into an Asserter interface with
                    the pre-determined, privately stored properties,
                    returning it back to the original Asserter() call.

                    @returns {function} The extended function.
                */
                return (function(newConverter) {
                    /**
                        The base Asserter function to be returned.
                        Note that the base function can be called
                        as a pass-through method for _assert without
                        needing to directly call LogInterface.log()

                        @param {any} [x] The item to extend and return to the Asserter class.
                        @returns {any} The extended item.
                    */
                    z.defineProperty(newConverter, "toBoolean", { get: function() { return toBoolean; }, writeable: false });
                    z.defineProperty(newConverter, "toDate", { get: function() { return toDate; }, writeable: false });
                    z.defineProperty(newConverter, "toNumber", { get: function() { return toNumber; }, writeable: false });
                    return newConverter;
                })(convert);
            }

            return Converter;
            
        })();

        z.classes.Converter = Converter;
        z.convert = new z.classes.Converter();
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    
    function factory(z) {

        z.classes = z.classes || {};

        /**
            A wrapper class used to register and execute custom named events.

            @class Contains an internal list of registered events.
        */
        var Events = (function() {

            /**
                Creates a new Events class.

                @constructor
            */
            function Events() {

                var _eventList = [];

                /**
                    Calls any registered functions under the given event name,
                    passing any additional provided arguments to those functions.

                    @param {string} eventName The name of the event to call.
                    @param {...any} var_args The arguments to pass to each of the registered events.
                    @returns {void}
                */
                var call = function(eventName) {
                    var events = _eventList[eventName];
                    if (events != null) {
                        for (var i = 0; i < events.length; i++) {
                            var ev = events[i];
                            if (ev.func != null) {
                                ev.func.apply(null, Array.prototype.slice.call(arguments, 1));
                            }
                        }
                    }
                };

                /**
                    Clears all registered functions for a given event name.
                    passing any additional provided arguments to those functions.

                    @param {string} eventName The name of the event for which to clear events.
                    @returns {void}
                */
                var clear = function(eventName) {
                    z.check.exists(eventName);
                    _eventList[eventName] = null;
                };

                /**
                    Registers a function for a provided event name.
                    passing any additional provided arguments to those functions.

                    @param {string} eventName The name of the event on which to register the function.
                    @param {function} eventFunc The function to register for the event.
                    @returns {function} The function used to deregister the event which was just registered.
                */
                var on = function(eventName, eventFunc) {
                    z.check.exists(eventName);
                    z.check.isFunction(eventFunc);
                    var eventList = (_eventList[eventName] || (_eventList[eventName] = []));
                    var currentEvent = {
                        func: eventFunc
                    };
                    eventList.push(currentEvent);
                    var deregister = function() {
                        _eventList[eventName].removeAll(function(x) { return x === currentEvent; }); // remove only by reference
                    };
                    return deregister;
                };

                /**
                    Extends an object into a events interface with
                    the pre-determined, privately stored properties,
                    returning it back to the original Events() call.

                    @param {object} eventsObj The object to extend with Events properties.
                    @returns {object} The extended object.
                */
                return (function(eventsObj) {
                    z.defineProperty(eventsObj, "call", { get: function() { return call; }, writeable: false });
                    z.defineProperty(eventsObj, "clear", { get: function() { return clear; }, writeable: false });
                    z.defineProperty(eventsObj, "on", { get: function() { return on; }, writeable: false });
                    return eventsObj;
                })({});

            }

            return Events;

        })();

        z.classes.Events = Events;
        z.events = new z.classes.Events();
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        var functions = z.functions = z.functions || {}; // note that z.functions is already defined with defaults in base.js

        /**
            Curries a function, allowing it to accept
            partial argument lists at differing times.

            @source {function} The function to curry.
            @returns The original curried function.
        */
        functions.curry = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.function ? this : arguments[argsIterator++];
            z.assert.isFunction(source);
            var sourceArgs = Array.prototype.slice.call(arguments);
            var sourceArgsLength = source.length;

            function curried(args) {
                if (args.length >= sourceArgsLength) {
                    return source.apply(null, args);
                }
                return function() {
                    return curried(args.concat(Array.prototype.slice.call(arguments)));
                }
            }
            return curried(sourceArgs);
        };
        
        /**
            Creates a deep copy of an original function.
            To be used for the function.prototype extension.
            
            @this {function}
            @returns A deep copy of the original function.
        */
        var _deepCopy = function() {
            return z.deepCopy(this);
        };

        /**
            Defines a property on this function.
            To be used for the function.prototype extension.
            
            @this {function}
            @param {string} name The name of the property.
            @param {any} prop The property to add.
            @returns {void}
         */
        var _defineProperty = function(name, propertyDefinition) {
            return z.defineProperty(this, name, propertyDefinition);
        };

        /**
            Determines the equality of two functions.
            To be used for the function.prototype extension.
            
            @this {function}
            @param {function} func2 The second function to compare.
            @returns True if both functions contain equal items, false if not.
         */
        var _equals = function(func2) {
            return z.equals(this, func2);
        };

        /**
            Extends the properties on the provided function arguments into the first function provided.
            To be used for the function.prototype extension.

            @this {function}
            @param {...function} var_args The tail functions to smash.
            @returns {any} A deep copy of the extended functions.
            @throws {error} An error is thrown if any of the provided arguments are not extendable.
        */
        var _extend = function(/* ...arguments */) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return z.functions.extend.apply(null, args);
        };

        /**
            Extends the properties on the provided function arguments into the first function provided.
            
            @param {...function} var_args The tail functions to use for extension.
            @returns {any} A deep copy of the extended functions.
            @throws {error} An error is thrown if any of the provided arguments are not extendable.
        */
        functions.extend = function(/* ...arguments */) {
            return z.extend.apply(null, arguments);
        };

        /**
            Returns the argument names for the function as an array.

            @param {function} source The function for which to collect arguments.
            @returns {array} An array containing any named arguments.
        */
        functions.getArgumentNames = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.function ? this : arguments[argsIterator++];
            z.assert.isFunction(source);
            var s = source.toString();
            var args = s.substring(s.indexOf("(")+1, s.indexOf(")")).trim().split(",");
            args.map(function(val, index, arr) {
                arr[index] = val.trim().replace(/(\n)?\/\*\*\//g, ""); // new Function() will append /**/ to argument lists, sometimes with a new line
            });
            return args;
        };

        /**
            Returns the body of the provided function as a string.

            @param {function} source The function from which to collect the body.
            @returns {string} A string representation of the function body.
        */
        functions.getBody = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.function ? this : arguments[argsIterator++];
            z.assert.isFunction(source);
            var s = source.toString();
            return s.toString().substring(s.indexOf("{")+1, s.indexOf("}")).trim();
        };

        /**
            Smashes the properties on the provided function arguments into a single function.
            To be used for the function.prototype extension.

            @this {function}
            @param {...function|object} var_args The tail functions to smash.
            @returns {any} A deep copy of the smashed functions.
            @throws {error} An error is thrown if any of the provided arguments are not functions.
        */
        var _smash = function(/* ...arguments */) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return z.functions.smash.apply(null, args);
        };

        /**
            Smashes the properties on the provided function arguments into a single function.
            
            @param {...function|object} var_args The tail functions to smash.
            @returns {any} A deep copy of the smashed functions.
            @throws {error} An error is thrown if any of the provided arguments are not functions.
        */
        functions.smash = function(/* ...arguments */) {
            return z.smash.apply(null, arguments);
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the function.prototype.
            
            @returns {void}
        */
        z.setup.initFunctions = function(usePrototype) {
            if (!!usePrototype) {
                z.defineProperty(Function.prototype, "curry", { enumerable: false, writable: false, value: functions.curry });
                z.defineProperty(Function.prototype, "deepCopy", { enumerable: false, writable: false, value: _deepCopy });
                z.defineProperty(Function.prototype, "defineProperty", { enumerable: false, writable: false, value: _defineProperty });
                z.defineProperty(Function.prototype, "equals", { enumerable: false, writable: false, value: _equals });
                z.defineProperty(Function.prototype, "extend", { enumerable: false, writable: false, value: _extend });
                z.defineProperty(Function.prototype, "getArgumentNames", { enumerable: false, writable: false, value: functions.getArgumentNames });
                z.defineProperty(Function.prototype, "getBody", { enumerable: false, writable: false, value: functions.getBody });
                z.defineProperty(Function.prototype, "smash", { enumerable: false, writable: false, value: _smash });
            }
        };
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        /**
            A method used by the location.parameters property which builds the 
            window.location.href query parameters into an object containing key value pairs.

            @returns {object} The object containing query parameter key value pairs.
        */
        var _regexPlus = /\+/g; // define once
        var getParameters = function() {
            var params = {};
            if (typeof window !== 'undefined') {
                var href = window.location.href;
                var indexOfQueries = href.indexOf("?");
                if (indexOfQueries > -1) {
                    var queries = href.substring(indexOfQueries+1).split("&");
                    for (var i = 0; i < queries.length; i++) {
                        var query = queries[i].split("=");
                        if (query.length != 2) continue;
                        params[query[0]] = decodeURIComponent(query[1].replace(_regexPlus, " "));
                    }
                }
            }
            return params;
        };

        /**
            A method used by the location.locale property which collects the locale from
            either the querystring parameters, or the navigator language and userLanguage properties.

            @returns {string} A string representation of the current locale.
        */
        var getLocale = function() {
            // note: "this" should be a pointer to the locationObj defined below
            return this.parameters.locale || navigator.language || navigator.userLanguage;
        };

        /**
            An interface class used with the window.location object.
            Note that the provided log interface is expected to contain at least
            a debug, error, info, log, and warn method.

            @class Contains a window.location interface.
        */
        var location = (function(locationObj) {
            z.defineProperty(locationObj, "parameters", { get: function() { return getParameters() }, writeable: false });
            z.defineProperty(locationObj, "locale", { get: function() { return getLocale.call(this) }, writeable: false });
            return locationObj;
        })({});

        z.location = location;
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(undefined) {

    function factory(z) {

        z.classes = z.classes || {};

        var data = {
            expectedMethods: [
                "log"
                // "debug"
                // , "error"
                // , "info"
                // , "log"
                // , "warn"
            ]
        };

        /**
            An internal helper function used to determine
            whether or not the provided logger object
            is a proper interface for the Log class.
        
            @param {object} logger The log interface to check for expected methods
        */
        var verifyLoggerInterface = function(logger) {
            z.assert.exists(logger);
            for (var i = 0; i < data.expectedMethods.length; i++) {
                var method = data.expectedMethods[i];
                z.assert.isFunction(logger[method]);
            }
        };

        /**
            Helper method used to binds the LogInterfaces's internal interface
            to the provided external logger interface methods.

            @param {object} loggerToBind The interface containing the expected log methods.
            @param {object} newLogInterface The object reference to the LogInterface's internal interface.
            @returns {void}
        */
        var bindLoggers = function(loggerToBind, newLogInterface) {
            verifyLoggerInterface(loggerToBind);
            newLogInterface.log = loggerToBind.log.bind(loggerToBind);

            // fall back to using the "log" method 
            newLogInterface.debug = z.check.exists(loggerToBind.debug) ? loggerToBind.debug.bind(loggerToBind) : loggerToBind.log.bind(loggerToBind);
            newLogInterface.error = z.check.exists(loggerToBind.error) ? loggerToBind.error.bind(loggerToBind) : loggerToBind.log.bind(loggerToBind);
            newLogInterface.info = z.check.exists(loggerToBind.info) ? loggerToBind.info.bind(loggerToBind) : loggerToBind.log.bind(loggerToBind);
            newLogInterface.warn = z.check.exists(loggerToBind.warn) ? loggerToBind.warn.bind(loggerToBind) : loggerToBind.log.bind(loggerToBind);
        };

        /**
            A wrapper class used to hold and execute different logging interfaces.
            Note that the provided log interface is expected to contain at least
            a debug, error, info, log, and warn method.

            @class Contains a provided logging interface.
         */
        var LogInterface = (function() {

            /**
                Creates a new Log class.

                @constructor
                @param {object} logger The interface containing the expected log methods.
                @param {bool} [enableDebugLogging] An override for enabling debug logging on Log class creation.
            */
            function LogInterface(logger, enableDebugLogging) {

                var _internalLogInterface = {};

                /**
                    Sets the use debug logging flag to the provided boolean.

                    @param {boolean} useDebugLogging The boolean used to set the debug logging flag.
                    @returns {void}
                */
                var setDebugLogging = function(useDebugLogging) {
                    if (z.getType(useDebugLogging) === z.types.string) {
                        useDebugLogging = (function(str) {
                            switch (str.toLowerCase().trim()) {
                                case "false":
                                case "0":
                                case "":
                                case null:
                                case undefined:
                                    return false;
                                default:
                                    return true;
                            }
                        })(useDebugLogging);
                    }
                    _internalLogInterface.useDebugLogging = !!useDebugLogging;
                };

                /**
                    Sets the already created log object
                    to the newly provided logger interface.

                    Note that method is also immediately executed
                    to initialize the provided logger interface.
                    
                    @param {object} newLogger The new logger interface.
                    @returns {void}
                */
                var setLogger; (setLogger = function setLogger(newLogger) {
                    bindLoggers(newLogger, _internalLogInterface);
                    setDebugLogging(enableDebugLogging != null ? enableDebugLogging : (z.location ? z.location.parameters["debug"] : false));
                })(logger);

                /**
                    Extends a function into a log interface with
                    the pre-determined, privately stored properties,
                    returning it back to the original Log() call.

                    @returns {function} The extended function.
                */
                return (function(newLog) {
                    /**
                        The base LogInterface function to be returned.
                        Note that the base function can be called
                        as a pass-through method for the _log without
                        needing to directly call LogInterface.log()

                        Note: Using this method seems a LOT safer,
                        and prevents _log from containing a self-reference.
                        The downside is that the console call will be recorded 
                        as coming from this location in log.js,
                        instead of the util.log() line in client code.

                        @param {any} [x] The item to pass to the LogInterface.log() function.
                        @returns {any} The extended item.
                    */
                    // var newLog = function(x) {
                    //     _log(x); // default a LogInterface(x) call to use _log(x)
                    // };

                    z.defineProperty(newLog, "debug", {
                        get: function() { 
                            if (_internalLogInterface.useDebugLogging) {
                                return _internalLogInterface.debug;
                            }
                            else {
                                return z.functions.empty;
                            }
                        },
                        writeable: false
                    });
                    z.defineProperty(newLog, "error", { get: function() { return _internalLogInterface.error; }, writeable: false });
                    z.defineProperty(newLog, "info", { get: function() { return _internalLogInterface.info; }, writeable: false });
                    z.defineProperty(newLog, "log", { get: function() { return _internalLogInterface.log; }, writeable: false });
                    z.defineProperty(newLog, "warn", { get: function() { return _internalLogInterface.warn; }, writeable: false });
                    z.defineProperty(newLog, "setDebugLogging", { get: function() { return setDebugLogging; }, writeable: false });
                    z.defineProperty(newLog, "setLogger", { get: function() { return setLogger; }, writeable: false });
                    return newLog;
                })(_internalLogInterface.log); // note these shenanigans -- seems dangerous, and _log will contain a self-reference
            }

            return LogInterface;
            
        })();

        /**
            Initializes a logger interface provided by the setup object.
            
            @returns {void}
        */
        z.setup.initLogger = function(defaultLogger) {
            if (z.check.exists(defaultLogger)) {
                z.log = new z.classes.LogInterface(defaultLogger);
            }
        };

        z.classes.LogInterface = LogInterface;
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        var numbers = z.numbers = {};

        /**
            Calculates and returns the factors for the provided integer.
            
            @param {integer} source The original integer.
            @returns An array containing the divisors for the integer.
        */
        numbers.factors = function(/* source */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            z.assert.isNumber(source);
            var small = [];
            var large = [];
            for (var i = 1; i <= Math.floor(Math.sqrt(source)); i++) {
                if (source % i == 0) {
                    small.push(i);
                    if (source / i !== i) {
                        large.push(source / i);
                    }
                }
            }
            return small.concat(large.reverse()); // note: push and reverse is anywhere from 2x-54x faster than using unshift
        }

        /**
            Rounds the provided number to the nearest provided step.
            
            @param {number} source The original number.
            @param {number} roundBy The step to round by.
            @returns {number}
        */
        numbers.round = function(/* source, roundBy, direction */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            var roundBy = arguments[argsIterator++] || 1;
            var direction = arguments[argsIterator++];
            z.assert.isNumber(source);
            if (direction) {
                direction = direction.toString().toLowerCase();
                if (direction === 'down') {
                    return z.numbers.roundDown(source, roundBy);
                }
                else if (direction === 'up') {
                    return z.numbers.roundUp(source, roundBy);
                }
            }
            return Math.round(source / roundBy) * roundBy;
        }

        /**
            Rounds the provided number down to the nearest provided step.
            
            @param {number} source The original number.
            @param {number} roundBy The step to round by.
            @returns {number} 
        */
        numbers.roundDown = function(/* source, roundBy */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            var roundBy = arguments[argsIterator++] || 1;
            z.assert.isNumber(source);
            return Math.floor(source / roundBy) * roundBy;
        };

        /**
            Rounds the provided number up to the nearest provided step.
            
            @param {number} source The original number.
            @param {number} roundBy The step to round by.
            @returns {number} 
        */
        numbers.roundUp = function(/* source, roundBy */) {
            var argsIterator = 0;
            var source = z.getType(this) === z.types.number ? this : arguments[argsIterator++];
            var roundBy = arguments[argsIterator++] || 1;
            z.assert.isNumber(source);
            return Math.ceil(source / roundBy) * roundBy;
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the Number.prototype.
            
            @returns {void}
        */
        z.setup.initNumbers = function(usePrototype) {
            if (!!usePrototype) {
                z.defineProperty(Number.prototype, "factors", { enumerable: false, writable: false, value: z.numbers.factors });
                z.defineProperty(Number.prototype, "round", { enumerable: false, writable: false, value: z.numbers.round });
                z.defineProperty(Number.prototype, "roundDown", { enumerable: false, writable: false, value: z.numbers.roundDown });
                z.defineProperty(Number.prototype, "roundUp", { enumerable: false, writable: false, value: z.numbers.roundUp });
            }
        };
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {
    
    function factory(z) {

        var objects = z.objects = {};
        
        /**
            Creates a deep copy of an original object.
            To be used for the Object.prototype extension.
            
            @this {object}
            @returns A deep copy of the original object.
         */
        var _deepCopy = function() {
            return z.deepCopy(this);
        };

        /**
            Defines a property on this object.
            To be used for the Object.prototype extension.
            
            @this {object}
            @param {string} name The name of the property.
            @param {any} prop The property to add.
            @returns {void}
         */
        var _defineProperty = function(name, propertyDefinition) {
            return z.defineProperty(this, name, propertyDefinition);
        };

        /**
            Determines the equality of two objects.
            To be used for the Object.prototype extension.
            
            @this {object}
            @param {object} obj2 The second object to compare.
            @returns True if both objects contain equal items, false if not.
         */
        var _equals = function(obj2) {
            return z.equals(this, obj2);
        };

        /**
            Extends the properties on the provided object arguments into the first object provided.
            To be used for the Object.prototype extension.

            @this {object}
            @param {...object} var_args The tail objects to smash.
            @returns {any} A deep copy of the smashed objects.
            @throws {error} An error is thrown if any of the provided arguments are not objects.
        */
        var _extend = function(/* arguments */) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return z.objects.extend.apply(null, args);
        };

        /**
            Extends the properties on the provided object arguments into the first object provided.
            
            @param {...object} var_args The tail objects to use for extension.
            @returns {any} A deep copy of the smashed objects.
            @throws {error} An error is thrown if any of the provided arguments are not objects.
        */
        objects.extend = function(/* arguments */) {
            return z.extend.apply(null, arguments);
        };

        /**
            Smashes the properties on the provided object arguments into a single object.
            To be used for the Object.prototype extension.

            @this {object}
            @param {...object} var_args The tail objects to smash.
            @returns {any} A deep copy of the smashed objects.
            @throws {error} An error is thrown if any of the provided arguments are not objects.
        */
        var _smash = function(/* arguments */) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return z.objects.smash.apply(null, args);
        };

        /**
            Smashes the properties on the provided object arguments into a single object.
            
            @param {...object} var_args The tail objects to smash.
            @returns {any} A deep copy of the smashed objects.
            @throws {error} An error is thrown if any of the provided arguments are not objects.
        */
        objects.smash = function(/* arguments */) {
            return z.smash.apply(null, arguments);
        };

        /**
            Initializes all pre-defined methods
            as non-enumerable and non-writable properties
            located on the Object.prototype.
            
            @returns {void}
        */
        z.setup.initObjects = function(usePrototype) {
            if (!!usePrototype) {
                z.defineProperty(Object.prototype, "deepCopy", { enumerable: false, writable: false, value: _deepCopy });
                z.defineProperty(Object.prototype, "defineProperty", { enumerable: false, writable: false, value: _defineProperty });
                z.defineProperty(Object.prototype, "equals", { enumerable: false, writable: false, value: _equals });
                z.defineProperty(Object.prototype, "extend", { enumerable: false, writable: false, value: _extend });
                z.defineProperty(Object.prototype, "smash", { enumerable: false, writable: false, value: _smash });
            }
        };
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}());/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
;(function(undefined) {

    function factory(z) {

        z.classes = z.classes || {};

        /**
            A class wrapper to contain a stack of stopwatches.
            
            @class Represents a stack of currently executing tasks.
        */
        var StopwatchStack = (function() {

            /**
                @constructor Initializes a new instance of the StopwatchStack class.
            */
            function StopwatchStack() {

                var _stopwatchStack = [];

                /**
                    Creates and pushes a new StopwatchWrapper onto the task
                    which contains the given taskDescription.
                
                    @param {string} taskDescription The description for the task to be timed.
                    @returns {void}
                */ 
                var _push = function(taskDescription) {
                    _stopwatchStack.push(new StopwatchWrapper(taskDescription));
                };

                /**
                    Pops the topmost executing StopwatchWrapper from the stack,
                    which in turn will log the execution time using util.log.
                 
                    @param {string} taskDescription The description for the task to be timed.
                    @returns {void}
                */
                var _pop = function() {
                    if (_stopwatchStack.length > 0) {
                        _stopwatchStack.pop().stop();
                    }
                };

                return (function(swObj) {
                    z.defineProperty(swObj, "push", { get: function() { return _push; }, writeable: false });
                    z.defineProperty(swObj, "pop", { get: function() { return _pop; }, writeable: false });
                    return swObj;
                })({});
            };

            return StopwatchStack;

        })();

        /**
            Creates a new StopwatchWrapper, designed to wrap
            the existing StopWatch class with a task description
            and a logging functionality.

            Used to keep the Stopwatch class clean,
            so it may be implemented without
            automated logging if necessary.

            @class Represents a currently executing task.
        */
        function StopwatchWrapper(taskDescription) {
            var sw = new Stopwatch();
            var taskDesc = taskDescription || "";
            this.stop = function() {
                sw.stop();
                z.log.debug(taskDesc + " took: " + sw.duration() + " ms");
            }
            sw.start();
        }

        /**
            Creates a new Stopwatch.
            
            @class Represents a timer.
        */
        function Stopwatch() {
            var _startTime = null;
            var _stopTime = null;
            var _running = false;

            /**
                Starts the stopwatch.
                
                @returns {void}
            */
            this.start = function() {
                if (!_running) {
                    _stopTime = null;
                    _running = true;
                    _startTime = new Date().getTime();
                }
            };

            /**
                Stops the stopwatch.
                
                @returns {void}
            */
            this.stop = function() {
                if(_running) {
                    _stopTime = new Date().getTime();
                    _running = false;
                }
            };

            /**
                Collects the execution duration for the stopwatch.
                
                @returns {number} The duration of the timer in milliseconds.
            */
            this.duration = function() {
                if (!_running) {
                    return (_stopTime - _startTime);
                }
                else {
                    return (new Date().getTime() - _startTime);
                }
            };

            /**
                Resets the stopwatch to the initialized state. the execution duration for the stopwatch.
                
                @returns {void}
            */
            this.reset = function() {
                _running = false;
                _startTime = null;
                _stopTime = null;
            };
        }

        z.classes.StopwatchStack = StopwatchStack;
        z.classes.StopwatchWrapper = StopwatchWrapper;
        z.classes.Stopwatch = Stopwatch;
        z.sw = new z.classes.StopwatchStack();
    }

    /**
        Locate root, and determine how to use the factory method.
    */
    var root = (
        typeof window !== 'undefined' ?
            window
            :  typeof window !== 'undefined' ?
                global 
                : this
    );
    if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        // define.amd exists
        define(function() { return factory });
        root.z = z; // expose to root in case require() is not being used to load zutil
    }
    else if (typeof module !== 'undefined') {
        _module = module;
        if (typeof module.exports !== 'undefined') {
            _module.exports = factory;
        }
    }
    else if (typeof root.z !== 'undefined') {
        // pass root.z to the factory
        factory(root.z);
    }

}()); 