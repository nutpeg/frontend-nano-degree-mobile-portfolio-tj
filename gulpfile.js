/** Use gulp to run the following tasks:
 *  - remove previous build image and css files
 *  - resize images
 *  - compress images
 *  - copy images to correct folders in dist folder
 *  - minify css files
 *  - copy css files to correct folder in dist folder
 *  - copy remaining files to dist folder
 * */

var gulp = require('gulp');
var csso = require('gulp-csso');
var del = require('del');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

gulp.task('default', function() {
  runSequence(
      'clean-dist',
      ['images', 'css-main', 'css-pizza', 'copy-to-dist']
  );
});

/** Create set of tasks to copy files from src to dist folder that 
 *  do not need any processing */
var copyToDistTasks = [];
var dirsToCopy = [
    'src/*.html',
    'src/views/*.html',
    'src/css/fonts/*.{eot,ttf,woff,woff2}',
    'src/js/*.js',
    'src/views/js/*.js'
];

dirsToCopy.forEach(function (dir, index) {
  var copyToDistTask = 'copyToDistFrom_' + index;
  var copyDestination = dir.replace(/^src/, 'dist').replace(/\/\*?\..{1,}/, '');
  gulp.task(copyToDistTask, function() {
    return gulp.src(dir).pipe(gulp.dest(copyDestination));
  });
  copyToDistTasks.push(copyToDistTask);
});

gulp.task('copy-to-dist', copyToDistTasks);

/** Run all image build processes */
gulp.task('images', function() {
  runSequence(
      ['clean-images'],
      ['resize-small-images', 'resize-medium-images'],
      ['images-index', 'images-pizza']
  );
});

/** Creates 100x75px version of image */
gulp.task('resize-small-images', function() {
  console.log('Resizing small images');

  return gulp.src('src/views/images/pizzeria.jpg')
      .pipe(rename({suffix: '-100x75'}))
      .pipe(imageResize({
        width : 100,
        height : 75,
        crop : true,
        upscale : false
      }))
      .pipe(gulp.dest('src/views/images/resized'));
});

/** Creates 720x540 version of image */
gulp.task('resize-medium-images', function() {
  console.log('Resizing medium images');

  return gulp.src('src/views/images/pizzeria.jpg')
      .pipe(rename({suffix: '-720x540'}))
      .pipe(imageResize({
        width : 720,
        height : 540,
        crop : true,
        upscale : false
      }))
      .pipe(gulp.dest('src/views/images/resized'));
});

/** Removes resized images from src folders */
gulp.task('clean-images', function(done) {
  console.log('Removing images from image folders');
  var files = [ 'views/images/resized/**' ];
  return del(files).then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

/** Optimizes image size and copies into production folder
 *  - for index.html page only 
 *  */
gulp.task('images-index', function() {
  console.log('Copying and compressing images for index.html');

  return gulp.src('src/img/*.*')
      .pipe(imagemin({optimizationLevel: 4}))
      .pipe(gulp.dest('dist/img'));
});

/** Optimizes image size and copies into production folder
 *  - for views/pizza.html only 
 *  */
gulp.task('images-pizza', function() {
  console.log('Copying and compressing images for views/pizza.html');

  return gulp.src(['src/views/images/resized/*.*', 'src/views/images/*.png'])
      .pipe(imagemin({optimizationLevel: 4}))
      .pipe(gulp.dest('dist/views/images'));
});

/** Minifies css files in src/css and places copies into production folder */
gulp.task('css-main', function() {
  console.log('Copying and minifying css from src/css');

  return gulp
      .src('src/css/*.css')
      .pipe(csso())
      .pipe(gulp.dest('dist/css'));
});

/** Minifies css files in src/views/css and places copies into production folder */
gulp.task('css-pizza', function() {
  console.log('Copying and minifying css from src/views/css');

  return gulp
      .src('src/views/css/*.css')
      .pipe(csso())
      .pipe(gulp.dest('dist/views/css'));
});

/** Removes dist folder */
gulp.task('clean-dist', function(done) {
  console.log('Removing dist folder');
  var files = [ 'dist/**' ];
  return del(files).then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});
