
var util = require("../src/node/base.js");
require("../src/node/arrays.js")(util);
require("../src/node/assert.js")(util);
require("../src/node/check.js")(util);
require("../src/node/db.js")(util);
require("../src/node/events.js")(util);
require("../src/node/generators.js")(util);
require("../src/node/log.js")(util);
require("../src/node/objects.js")(util);
require("../src/node/stopwatch.js")(util);

console.debug = console.log;
var z = new util({
	useArrayExtensions: true,
	useGeneratorExtensions: true,
	useObjectExtensions: true,
	defaultLogger: console
});
var unitTests = require("../src/node/unitTests.js")(z);
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