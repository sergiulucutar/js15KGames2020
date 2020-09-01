var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('build', function () {
  return gulp
    .src('./src/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('copy', function () {
  gulp
    .src('./src/**/*.html')
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  return gulp
    .src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  browserSync.init({
    server: './build'
  });
  gulp.watch('./src/**/*.js', ['build']);
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.html', ['copy']);
});

gulp.task('default', ['build', 'sass', 'copy', 'watch']);
