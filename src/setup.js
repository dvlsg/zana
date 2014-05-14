/**
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(w, undefined) {
    var z = w.util || {};

    var setup = function(settings) {
        settings = settings || {};
        z.setup.initArrays(settings.usePrototype);
        z.setup.initObjects(settings.usePrototype);
    }
    
    z.setup = setup; // note, this will override all previous settings for util.setup -- this should be fine, as all function pointers will have been collected already
    w.util = z;
}(window || this));