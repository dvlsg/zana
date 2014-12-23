var gulp        = require('gulp');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');

gulp.task('build-browser:copy-src', ['lint', 'test'], function() {
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
    .pipe(gulp.dest('bin/browser/development/'));
});

gulp.task('build-browser:minify-src', ['lint', 'test'], function() {
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
        'src/stopwatch.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.extname = '.min.js';
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('bin/browser/production/'));
});

gulp.task('build-browser:combine-develop-src', ['lint', 'test'], function() {
    // note - don't include zana-setup.js by default.
    // leave separate so the end-user can determine
    // for themselves whether to use extension methods.
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
        'src/stopwatch.js'
    ])
    .pipe(concat('zana.js'))
    .pipe(gulp.dest('bin/browser/development/'));
});

gulp.task('build-browser:combine-production-src', ['lint', 'test'], function() {
    // recombine develop source and reminify ?
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
        'src/stopwatch.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('zana.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('bin/browser/production/'));
});

gulp.task('build-browser', [
      'build-browser:copy-src'
    , 'build-browser:minify-src'
    , 'build-browser:combine-develop-src'
    , 'build-browser:combine-production-src'
]);