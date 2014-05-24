/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
module.exports = function(util) {

    var z = util.prototype;
    z.objects = {};

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
    }

    /**
        Smashes the properties on the provided object arguments into a single object.
        
        @param {...object} var_args The tail objects to smash.
        @returns {any} A deep copy of the smashed objects.
        @throws {error} An error is thrown if any of the provided arguments are not objects.
    */
    z.objects.smash = function(/* arguments */) {
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
            z.defineProperty(Object.prototype, "smash", { enumerable: false, writable: false, value: _smash });
        }
    };
};