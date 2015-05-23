// /*
//     @license
//     Copyright (C) 2014 Dave Lesage
//     License: MIT
//     See license.txt for full license text.
// */
// "use strict";

// export default class Objects {

//     constructor({ util }) {
//         this.util = util;
//     }

//     isEmpty(obj) {
//         for (let prop in obj) {
//             if (obj.hasOwnProperty(prop))
//                 return false;
//         }
//         return true;
//     }
// }

// ;(function(undefined) {
//     function factory(z) {

//         var objects = z.objects = {};
        
//         /**
//             Creates a deep copy of an original object.
//             To be used for the Object.prototype extension.
            
//             @this {object}
//             @returns A deep copy of the original object.
//          */
//         var _deepCopy = function() {
//             return z.deepCopy(this);
//         };

//         /**
//             Defines a property on this object.
//             To be used for the Object.prototype extension.
            
//             @this {object}
//             @param {string} name The name of the property.
//             @param {any} prop The property to add.
//             @returns {void}
//          */
//         var _defineProperty = function(name, propertyDefinition) {
//             return z.defineProperty(this, name, propertyDefinition);
//         };

//         /**
//             Determines the equality of two objects.
//             To be used for the Object.prototype extension.
            
//             @this {object}
//             @param {object} obj2 The second object to compare.
//             @returns True if both objects contain equal items, false if not.
//          */
//         var _equals = function(obj2) {
//             return z.equals(this, obj2);
//         };

//         /**
//             Extends the properties on the provided object arguments into the first object provided.
//             To be used for the Object.prototype extension.

//             @this {object}
//             @param {...object} var_args The tail objects to smash.
//             @returns {any} A deep copy of the smashed objects.
//             @throws {error} An error is thrown if any of the provided arguments are not objects.
//         */
//         var _extend = function(/* arguments */) {
//             var args = Array.prototype.slice.call(arguments);
//             args.unshift(this);
//             return z.objects.extend.apply(null, args);
//         };

//         /**
//             Extends the properties on the provided object arguments into the first object provided.
            
//             @param {...object} var_args The tail objects to use for extension.
//             @returns {any} A deep copy of the smashed objects.
//             @throws {error} An error is thrown if any of the provided arguments are not objects.
//         */
//         objects.extend = function(/* arguments */) {
//             return z.extend.apply(null, arguments);
//         };

//         /**
//             Determines if an object is empty.
//             To be used for the Object.prototype extension.
            
//             @this {object}
//             @returns True if the object does contain any properties, false if not.
//          */
//         var _isEmpty = function() {
//             return z.objects.isEmpty(this);
//         };

//         /**
//             Determines if an object is empty.
//             To be used for the Object.prototype extension.
            
//             @param {object} obj The object to check for emptiness.
//             @returns True if the object does contain any properties, false if not.
//          */
//         objects.isEmpty = function(obj) {
//             for (var prop in obj) {
//                 if (obj.hasOwnProperty(prop))
//                     return false;
//             }
//             return true;
//         };

//         /**
//             Smashes the properties on the provided object arguments into a single object.
//             To be used for the Object.prototype extension.

//             @this {object}
//             @param {...object} var_args The tail objects to smash.
//             @returns {any} A deep copy of the smashed objects.
//             @throws {error} An error is thrown if any of the provided arguments are not objects.
//         */
//         var _smash = function(/* arguments */) {
//             return z.smash(this, ...arguments);
//         };

//         /**
//             Smashes the properties on the provided object arguments into a single object.
            
//             @param {...object} var_args The tail objects to smash.
//             @returns {any} A deep copy of the smashed objects.
//             @throws {error} An error is thrown if any of the provided arguments are not objects.
//         */
//         objects.smash = function(/* arguments */) {
//             return z.smash(...arguments);
//         };

//         /**
//             Places all object extensions on the provided object or prototype.

//             @param {obj} object The object to be extended with object methods.
//         */
//         objects.extendTo = function(obj) {
//             z.defineProperty(obj, "deepCopy", { enumerable: false, writable: true, value: _deepCopy });
//             z.defineProperty(obj, "defineProperty", { enumerable: false, writable: true, value: _defineProperty });
//             z.defineProperty(obj, "equals", { enumerable: false, writable: true, value: _equals });
//             z.defineProperty(obj, "extend", { enumerable: false, writable: true, value: _extend });
//             z.defineProperty(obj, "isEmpty", { enumerable: false, writable: true, value: _isEmpty });
//             z.defineProperty(obj, "smash", { enumerable: false, writable: true, value: _smash });
//         };