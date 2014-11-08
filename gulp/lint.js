var gulp    = require('gulp');
var jshint  = require('gulp-jshint');

gulp.task('lint', function() {
    return gulp.src([
        'src/base.js',
        'src/arrays.js',
        'src/assert.js',
        'src/check.js',
        'src/convert.js',
        'src/events.js',
        'src/functions.js',
        'src/location.js',
        'src/log.js',
        'src/numbers.js',
        'src/objects.js',
        'src/stopwatch.js',
        'src/zana-browser.js',
        'src/zana-node.js',
        'src/zana-require.js'
    ])
    .pipe(jshint({
        eqnull: true,
        unused: true,
        laxcomma: true,
        laxbreak: true
    }))
    .pipe(jshint.reporter('default'));
});