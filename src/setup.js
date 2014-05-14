/**
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(w, undefined) {
    var z = w.util || {};

    /**
        Executes setup methods based on the provided settings object.
         
        @param {object} settings The settings object.
        @param {boolean} [requestInfo.useArrayExtensions] A boolean flag used to determine whether or not to extend Array.prototype.
        @param {boolean} [requestInfo.useObjectExtensions] A boolean flag used to determine whether or not to extend Object.prototype.
    */
    var setup = function(settings) {
        settings = settings || {};
        z.setup.initArrays(settings.useArrayExtensions);
        z.setup.initObjects(settings.useObjectExtensions);
    }
    
    z.setup = setup; // note, this will override all previous settings for util.setup -- this should be fine, as all function pointers will have been collected already
    w.util = z;
}(window || this));