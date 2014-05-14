/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(w, undefined) {
    var z = w.util || {};

    /**
        Creates a deep copy of an original object.
        
        @this {object}
        @returns A deep copy of the original object.
     */
    var deepCopy = function() {
        return z.deepCopy(this);
    };

    /**
        Defines a property on this object.
        
        @this {object}
        @param {string} name The name of the property.
        @param {any} prop The property to add.
        @returns {void}
     */
    var defineProperty = function(name, propertyDefinition) {
        return z.defineProperty(this, propertyDefinition);
    };

    /**
        Determines the equality of two objects.
        
        @this {object}
        @param {object} obj2 The second object to compare.
        @returns True if both objects contain equal items, false if not.
     */
    var equals = function(obj2) {
        return z.equals(this, obj2);
    };

    /**
        Smashes the properties on the provided object arguments into a single object.
        
        @this {object} The first object to smash.
        @param {...object} var_args The tail objects to smash.
        @returns {any} A deep copy of the smashed objects.
        @throws {error} An error is thrown if any of the provided arguments are not objects.
    */
    var smash = function(/* arguments */) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this); // maintain order of this, arg0, arg1, ... by using unshift
        return z.smash.apply(this, args);
    };

    /**
        Initializes all pre-defined methods
        as non-enumerable and non-writable properties
        located on the Object.prototype.
        
        @returns {void}
    */
    z.setup.initObjects = function(usePrototype) {
        var toExtend = (!!usePrototype ? Object.prototype : (z.object = z.object || {}));
        z.defineProperty(toExtend, "deepCopy", { enumerable: false, writable: false, value: deepCopy });
        z.defineProperty(toExtend, "defineProperty", { enumerable: false, writable: false, value: defineProperty });
        z.defineProperty(toExtend, "equals", { enumerable: false, writable: false, value: equals });
        z.defineProperty(toExtend, "smash", { enumerable: false, writable: false, value: smash });
    };

    w.util = z;
})(window || this);