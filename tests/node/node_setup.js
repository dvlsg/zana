


var z = require("../../src/web/base.js");
require("../../src/web/arrays.js")(z);
require("../../src/web/assert.js")(z);
require("../../src/web/check.js")(z);
require("../../src/web/convert.js")(z);
require("../../src/web/events.js")(z);
require("../../src/web/functions.js")(z);
require("../../src/web/location.js")(z); // not that location doesn't really make sense in NodeJS -- more of a browser plugin
require("../../src/web/log.js")(z);
require("../../src/web/numbers.js")(z);
require("../../src/web/objects.js")(z);
require("../../src/web/stopwatch.js")(z);
require("../web/unitTests.js")(z);
z.setup({
	useArrayExtensions: true,
	useFunctionExtensions: true,
	useGeneratorExtensions: true,
	useNumberExtensions: true,
	useObjectExtensions: true,
	defaultLogger: console
});
z.runUnitTests();
module.exports = z;