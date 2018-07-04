'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var minifyCSS = require('gulp-csso');
var pump = require('pump');

//CSS Files minify and Sync
gulp.task('cssFiles', () => {
    gulp.src('./css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/css/'));
});
