'use strict';

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');

//Improve Images and move to dist folder
gulp.task('images', () => {
  gulp.src('./images/*.*')
      .pipe(imagemin({
        //using imagemin as pe lessons
        interlaced: true,
        progressive: true,
        optimizationLevel: 5
      }))
      //Pushing to destination
      .pipe(gulp.dest('./dist/images/'));
});
