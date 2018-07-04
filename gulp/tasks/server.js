'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var connect = require('gulp-connect');

gulp.task('server', () => {
    connect.server({
        root: 'dist',
        port: 8000,
        livereload: true
    })
});
