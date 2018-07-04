'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var pump = require('pump');

//Improving JS Files with uglify
gulp.task('scriptFiles', (cb) => {
    pump([
        gulp.src(['./js/*.js']),
        uglify(),
        gulp.dest('./dist/js/')
    ], cb);
});
