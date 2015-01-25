var concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    inject = require('gulp-inject'),
    rev = require('gulp-rev'),
    sysBuilder = require('systemjs-builder'),
    uglify = require('gulp-uglify');

var COPY_FILES = ['./index.html', './styles.css'];
var MINIFIED_JS = [
  './node_modules/underscore/underscore-min.js',
  './node_modules/protomatter/protomatter.min.js',
  './node_modules/baconjs/dist/Bacon.min.js',
];
var UNMINIFIED_JS = [
  './node_modules/traceur/bin/traceur-runtime.js',
  './build/modules.js'
];

gulp.task('clean_build', function(callback) {
  del('./build/**/*', callback);
});

gulp.task('copy_files', ['clean_build'], function() {
  return gulp.src(COPY_FILES)
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy_images', ['copy_files'], function() {
  return gulp.src('./images/**')
    .pipe(gulp.dest('./build/images/'));
});

gulp.task('build_modules', ['copy_images'], function(callback) {
  sysBuilder.buildSFX('./js/app', './build/modules.js')
    .then(callback);
});

gulp.task('minify_js', ['build_modules'], function() {
  return gulp.src(UNMINIFIED_JS)
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(concat('minified.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('concat_js', ['minify_js'], function() {
  return gulp.src(MINIFIED_JS.concat(['./build/minified.js']))
    .pipe(concat('app.js'))
    .pipe(rev())
    .pipe(gulp.dest('./build/'));
});

gulp.task('build_cleanup', ['concat_js'], function(callback) {
  del(['./build/app.js', './build/minified.js', './build/modules.js'], callback);
});

gulp.task('update_script', ['build_cleanup'], function() {
  return gulp.src('./build/index.html')
    .pipe(
      inject(gulp.src('./build/*.js', {read: false}), {relative: true})
    )
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['update_script']);
