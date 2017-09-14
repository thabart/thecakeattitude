var gulp = require('gulp');
var watch = require('gulp-watch');
var webpack = require('webpack-stream');
var livereload = require('gulp-livereload');

process.env['NODE_ENV'] = 'development';

gulp.task('watch', function() {
  return watch('src/**/*.js', function() {
    webpack(require('./webpack.config.js')).pipe(livereload());
  });    
});

gulp.task('default', [ 'watch' ]);
