
var zUtil = require("../../src/node/base.js");
require("../../src/node/arrays.js")(zUtil);
require("../../src/node/assert.js")(zUtil);
require("../../src/node/check.js")(zUtil);
require("../../src/node/db.js")(zUtil);
require("../../src/node/events.js")(zUtil);
require("../../src/node/generators.js")(zUtil);
require("../../src/node/log.js")(zUtil);
require("../../src/node/objects.js")(zUtil);
require("../../src/node/stopwatch.js")(zUtil);

console.debug = console.log;
var z = new zUtil({
	useArrayExtensions: true,
	useGeneratorExtensions: true,
	useObjectExtensions: true,
	defaultLogger: console
});
var unitTests = require("../node_unitTests.js")(z);
var log = z.log;

var arr1 = [1, 2, 3, 4, 5];
var gen;
var gen1 = arr1.where(function(x) { return x > 3; });
var gen2 = arr1.where(function(x) { return x >= 4; });

console.log(z.equals(gen1, gen2));

gen2 = arr1.where(function(x) { return x >= 4; });
for (var i in gen2) {
	console.log(gen2[i]);
}

for (let i of [1,2,3,4,5].asGenerator()) {
	log(i);
}

gen = [1,2,3,4,5].asGenerator();
log(z.getType(gen));


// for (var i = 0; i < arr1.asGenerator().toArray().length; i++) {
	// log(arr1[i]);
// }
// console.log(gen2[1]);
// console.log(unitTests);
// unitTests.runUnitTests();