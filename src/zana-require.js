// definition for requiring zana
// including customization/plugin selection
define([
    '../../bin/require/base.js',
    '../../bin/require/arrays.js',
    '../../bin/require/assert.js',
    '../../bin/require/check.js',
    '../../bin/require/convert.js',
    '../../bin/require/events.js',
    '../../bin/require/functions.js',
    '../../bin/require/location.js',
    '../../bin/require/log.js',
    '../../bin/require/numbers.js',
    '../../bin/require/objects.js',
    '../../bin/require/stopwatch.js',
], function(
    z,
    arraysPlugin,
    assertPlugin,
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
    checkPlugin(z);
    convertPlugin(z);
    eventsPlugin(z);
    functionsPlugin(z);
    locationPlugin(z);
    logPlugin(z);
    numbersPlugin(z);
    objectsPlugin(z);
    stopwatchPlugin(z);
    return z;
});