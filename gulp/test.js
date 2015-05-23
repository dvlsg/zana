var gulp    = require('gulp');
var mocha   = require('gulp-mocha');
var eslint  = require('gulp-jshint');

require('babel-core/register'); // for mocha tests

var srcDir = './src/';
var srcGlob = srcDir + '*.js';

var distDir = './dist';
var distGlob = './';

gulp.task('lint', function() {
    return gulp.src(srcGlob)
    .pipe(eslint())
    .pipe(eslint.format())
});

gulp.task('test', ['lint'], function() {
    return gulp.src([
        'tests/test.js'
    ])
    .pipe(mocha({ reporter: 'spec' }));
});