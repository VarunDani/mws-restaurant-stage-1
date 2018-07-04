'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('watch', () => {
    //All html Files
    gulp.watch('./*.html', ['html']);
    //All JS Files
    gulp.watch('./js/*.js', ['js']);
    //Service worker
    gulp.watch('./sw.js', ['manifestFiles']);
    //manifest Files
    gulp.watch('./*.json', ['manifestFiles']);
    //CSS Files including main.css
    gulp.watch('./css/*.css', ['css']);
    //Image changes
    gulp.watch('./images/*.*', ['images']);
});
