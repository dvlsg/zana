// definition for requiring zutil
// including customization/plugin selection
define([
    '../../src/web/base.js',
    '../../src/web/arrays.js',
    '../../src/web/assert.js',
    '../../src/web/cache.js',
    '../../src/web/check.js',
    '../../src/web/convert.js',
    '../../src/web/events.js',
    '../../src/web/functions.js',
    '../../src/web/location.js',
    '../../src/web/log.js',
    '../../src/web/numbers.js',
    '../../src/web/objects.js',
    '../../src/web/stopwatch.js',
    '../../tests/web/unitTests.js',
], function(
    z,
    arraysPlugin,
    assertPlugin,
    cachePlugin,
    checkPlugin,
    convertPlugin,
    eventsPlugin,
    functionsPlugin,
    locationPlugin,
    logPlugin,
    numbersPlugin,
    objectsPlugin,
    stopwatchPlugin
) {
    arraysPlugin(z);
    assertPlugin(z);
    cachePlugin(z);
    checkPlugin(z);
    convertPlugin(z);
    eventsPlugin(z);
    functionsPlugin(z);
    locationPlugin(z);
    logPlugin(z);
    numbersPlugin(z);
    objectsPlugin(z);
    stopwatchPlugin(z);
    z.setup({
        useArrayExtensions: true,
        useFunctionExtensions: true,
        useNumberExtensions: true,
        useObjectExtensions: true,
        defaultLogger: console
    });
    console.log(z);
    return z;
});