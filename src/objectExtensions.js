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
        Initializes all pre-defined methods
        as non-enumerable and non-writable properties
        located on the Object.prototype.
        
        @returns {void}
     */
    (function() {
        z.defineProperty(Object.prototype, "deepCopy", { enumerable: false, writable: false, value: deepCopy });
        z.defineProperty(Object.prototype, "defineProperty", { enumerable: false, writable: false, value: defineProperty });
        z.defineProperty(Object.prototype, "equals", { enumerable: false, writable: false, value: equals });
    })();

    w.util = z;
})(window || this);