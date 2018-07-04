'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var htmlmin = require('gulp-htmlmin');
var pump = require('pump');

//Generatl htmlFiles for gulp task
gulp.task('htmlFiles', () => {
    gulp.src('./*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        //To Destination
        .pipe(gulp.dest('./dist/'));
});

gulp.task('manifestFiles', () => {
    //Manifest Files movement
    gulp.src('./*.*').pipe(gulp.dest('./dist/'));
});
