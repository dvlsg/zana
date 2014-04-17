/*
 * @license
 * Copyright (C) 2014 Dave Lesage
 * License: MIT
 * See license.txt for full license text.
 */
(function(w, undefined) {
    var z = w.util || {};

    /**
     * Creates a deep copy of an original object.
     * 
     * @this {object}
     * @returns A deep copy of the original object.
     */
    var deepCopy = function() {
        return z.deepCopy(this);
    };

    /**
     * Determines the equality of two objects.
     * 
     * @this {object}
     * @param {object} obj2 The second object to compare.
     * @returns True if both objects contain equal items, false if not.
     */
    var equals = function(obj2) {
        return z.equals(this, obj2);
    };

    /**
     * Initializes all pre-defined methods
     * as non-enumerable and non-writable properties
     * located on the Object.prototype.
     * 
     * @returns {void}
     */
    (function() {
        var internalSetup = function(obj) {
            if (obj.proto[obj.name] == null) {
                Object.defineProperty(obj.proto, obj.name, {
                    enumerable: false,
                    writable: false,
                    value: obj.func
                });
            }
            else {
                console.error(
                    "Error: the method " 
                    + obj.name 
                    + " has already been defined on the following prototype: " 
                    + obj.proto
                );
            }
        };
        internalSetup({proto: Object.prototype, name: "deepCopy", func: deepCopy});
        internalSetup({proto: Object.prototype, name: "equals", func: equals});
    })();

    w.util = z;
})(window || this);