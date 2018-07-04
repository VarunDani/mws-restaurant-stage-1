/**
  Index File For Gulp Tasks
*/

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var requireDir = require('require-dir');

// Tasks For Gulp Build
var tasks = requireDir('./tasks');

//Adding Watch to Source Files and Change dist
require('./watch');

//Task for StartingServer
gulp.task('startServer', ['server', 'watch']);
//Tasks for setting up and transfering files to prod folder (folder: dist)
gulp.task('setupProd', ['htmlFiles', 'scriptFiles', 'cssFiles', 'images','manifestFiles']);

gulp.task('default', ['setupProd', 'startServer']);
