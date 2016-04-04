/** Use gulp to run the following tasks:
 *  - remove previous build image and css files
 *  - resize images
 *  - compress images
 *  - copy images to correct folders
 *  - minify css files
 *  - copy css files to correct folder
 * */

var gulp = require('gulp');
var csso = require('gulp-csso');
var del = require('del');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

gulp.task('default', ['images', 'css']);

/** Run all image build processes */
gulp.task('images', function() {
  runSequence(
      'clean-images',
      ['resize-small-images', 'resize-medium-images'],
      ['images-index', 'images-pizza']
  );
});

/** Creates 100x75px version of image */
gulp.task('resize-small-images', function() {
  console.log('Resizing small images');

  return gulp.src('views/images/uncompressed/pizzeria.jpg')
      .pipe(rename({suffix: '-100x75'}))
      .pipe(imageResize({
        width : 100,
        height : 75,
        crop : true,
        upscale : false
      }))
      .pipe(gulp.dest('views/images/uncompressed/resized'));
});

/** Creates 720x540 version of image */
gulp.task('resize-medium-images', function() {
  console.log('Resizing medium images');

  return gulp.src('views/images/uncompressed/pizzeria.jpg')
      .pipe(rename({suffix: '-720x540'}))
      .pipe(imageResize({
        width : 720,
        height : 540,
        crop : true,
        upscale : false
      }))
      .pipe(gulp.dest('views/images/uncompressed/resized'));
});

/** Removes resized and compressed images from production folders */
gulp.task('clean-images', function(done) {
  console.log('Removing images from image folders');
  var files = [ 'views/images/*.*', 'views/images/uncompressed/resized/*.*', 'img/*.*' ];
  return del(files).then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

/** Optimzes image size and copies into production folder
 *  - for index.html page only 
 *  */
gulp.task('images-index', function() {
  console.log('Copying and compressing images for index.html');

  return gulp.src('img/uncompressed/*.*')
      .pipe(imagemin({optimizationLevel: 4}))
      .pipe(gulp.dest('img'));
});

/** Optimzes image size and copies into production folder 
 *  - for views/pizza.html only 
 *  */
gulp.task('images-pizza', function() {
  console.log('Copying and compressing images for views/pizza.html');

  return gulp.src(['views/images/uncompressed/resized/*.*', 'views/images/uncompressed/*.png'])
      .pipe(imagemin({optimizationLevel: 4}))
      .pipe(gulp.dest('views/images'));
});

/** Minifies css files and places copies into production folder */
gulp.task('css', ['clean-css'], function() {
  console.log('Copying and minifies css');

  return gulp
      .src('css/uncompressed/*.css')
      .pipe(csso())
      .pipe(gulp.dest('css'));
});

/** Removes minified css from production folder */
gulp.task('clean-css', function(done) {
  console.log('Removing css from ./css folder');
  var files = [ 'css/*.css'];
  return del(files).then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});