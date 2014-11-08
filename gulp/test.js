var gulp    = require('gulp');
var mocha   = require('gulp-mocha');

gulp.task('test', ['lint'], function() {
    return gulp.src([
        'tests/test.js'
    ])
    .pipe(mocha({ reporter: 'spec' }));
});