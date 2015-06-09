var gulp    = require('gulp');
var mocha   = require('gulp-mocha');
var eslint  = require('gulp-eslint');
var plumber = require('gulp-plumber');
var babel   = require('gulp-babel');
var del     = require('del');

require('babel-core/register'); // for mocha tests

var srcDir = './src/';
var srcGlob = srcDir + '*.js';

var distDir = './dist';
var distGlob = './*.js';

// override during development phase
srcGlob = [
    srcDir + 'zana.js',
    srcDir + 'util.js',
    srcDir + 'check.js',
    srcDir + 'assert.js',
    srcDir + 'convert.js',
    srcDir + 'logger.js',
    srcDir + 'functions.js',
    srcDir + 'stopwatch.js',
    srcDir + 'iterables.js',
    srcDir + 'channel.js',
    srcDir + 'data-structures.js'
];

gulp.task('lint', function() {
    return gulp.src(srcGlob)
        .pipe(eslint()) // config in .eslintrc
        .pipe(eslint.format())
});

gulp.task('test', ['lint'], function() {
    return gulp.src([
        'tests/channel.spec.js'
    ])
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('clean', function() {
    return del(distDir);
});

gulp.task('build', ['lint'], function() {
    return gulp.src(srcGlob)
        .pipe(plumber())
        .pipe(babel()) // config in .babelrc
        .pipe(plumber.stop())
        .pipe(gulp.dest(distDir))
});

gulp.task('watch', ['build'], function() {
    gulp.watch(srcGlob, ['build']);
});

gulp.task('default', ['lint']);