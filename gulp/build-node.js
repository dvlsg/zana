var gulp    = require('gulp');
var rename  = require('gulp-rename');

gulp.task('build-node:copy-src', ['lint', 'test'], function() {
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
    ])
    .pipe(gulp.dest('bin/node/'));
});

gulp.task('build-node:copy-setup', ['lint', 'test'], function() {
    return gulp.src([
        'src/zana-node.js'
    ])
    .pipe(rename('zana.js'))
    .pipe(gulp.dest('bin/node/'));
});

gulp.task('build-node', [
      'build-node:copy-src'
    , 'build-node:copy-setup'
]);