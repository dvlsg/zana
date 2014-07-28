
// don't use the minified files
// the modular loading style of NodeJS won't work with the minified file,
// and NodeJS doesn't really gain anything from minified codebases anyways

// note that runUnitTests will only be executed during the first require
// all others will return a cached pointer to the z object
var z = require('./node_setup.js'); 
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');
z = require('./node_setup.js');

// var z = require("../../src/web/base.js");
// require("../../src/web/arrays.js")(z);
// require("../../src/web/assert.js")(z);
// require("../../src/web/check.js")(z);
// require("../../src/web/convert.js")(z);
// require("../../src/web/events.js")(z);
// require("../../src/web/functions.js")(z);
// require("../../src/web/location.js")(z); // not that location doesn't really make sense in NodeJS -- more of a browser plugin
// require("../../src/web/log.js")(z);
// require("../../src/web/numbers.js")(z);
// require("../../src/web/objects.js")(z);
// require("../../src/web/stopwatch.js")(z);
// require("../web/unitTests.js")(z);
// z.setup({
// 	useArrayExtensions: true,
// 	useFunctionExtensions: true,
// 	useGeneratorExtensions: true,
// 	useNumberExtensions: true,
// 	useObjectExtensions: true,
// 	defaultLogger: console
// });



// console.debug = console.log;
// var z = new zUtil({
// 	useArrayExtensions: true,
// 	useGeneratorExtensions: true,
// 	useObjectExtensions: true,
// 	defaultLogger: console
// });
// var unitTests = require("../node_unitTests.js")(z);
// var log = z.log;

// var arr1 = [1, 2, 3, 4, 5];
// var gen;
// var gen1 = arr1.where(function(x) { return x > 3; });
// var gen2 = arr1.where(function(x) { return x >= 4; });

// console.log(z.equals(gen1, gen2));

// gen2 = arr1.where(function(x) { return x >= 4; });
// for (var i in gen2) {
// 	console.log(gen2[i]);
// }

// for (let i of [1,2,3,4,5].asGenerator()) {
// 	log(i);
// }

// gen = [1,2,3,4,5].asGenerator();
// log(z.getType(gen));


// for (var i = 0; i < arr1.asGenerator().toArray().length; i++) {
	// log(arr1[i]);
// }
// console.log(gen2[1]);
// console.log(unitTests);
// unitTests.runUnitTests();