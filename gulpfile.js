var gulp       = require('gulp');
var jade       = require('gulp-jade');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var uglify     = require('gulp-uglify');
var streamify  = require('gulp-streamify');
var gulpif     = require('gulp-if');
var sass       = require('gulp-sass');
var connect    = require('gulp-connect-multi')();
var plumber    = require('gulp-plumber');
var os         = require('os');


var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

var browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

gulp.task('jade', function(){
    return gulp.src('src/templates/**/*.jade')
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});

gulp.task('js', function(){
    return browserify('./src/js/main.js', { debug: env === 'development' }).bundle()
    .pipe(plumber())
    .pipe(source('bundle.js'))
    .pipe(gulpif(env === 'production', streamify(uglify())))
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(connect.reload());
});

gulp.task('sass', function(){
    var config = {};
    if (env === 'development'){
        config.sourceComments = 'map';
    }

    if (env === 'production'){
        config.outputStyle = "compressed";
    }

    return gulp.src('src/sass/main.scss')
      .pipe(plumber())
      .pipe(sass(config))
      .pipe(gulp.dest(outputDir + '/css'))
      .pipe(connect.reload());
});

gulp.task('watch', function(){
    gulp.watch('src/templates/**/*.jade', ['jade']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('connect', connect.server({
  root: [outputDir],
  port: 8888,
  livereload: true,
  open: {
    //browser: 'Chrome' // if not working OS X browser: 'Google Chrome'
    browser: browser
  }
}));

// you can use run-sequence
gulp.task('default', ['js', 'jade', 'sass', 'watch', 'connect']);

// 1. run with >gulp jade
// 2. SET NODE_ENV=development
// 2.1 gulp js

// 3. gulp
