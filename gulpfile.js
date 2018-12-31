const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');

gulp.task('clear', () => {
  return gulp.src('dist/', { read: false }).pipe(clean());
});

gulp.task('build', ['clear'], () =>
  gulp
    .src(['src/**/*.js'])
    .pipe(
      babel({
        presets: ['es2015']
      })
    )
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', ['build'], () => {
  return gulp.watch(
    ['src/**/*.js', 'test/**/*.js', 'src/**/*.json'],
    ['build']
  );
});

gulp.task('start', ['watch'], function() {
  nodemon({
    script: './dist/app.js'
  });
});

gulp.task('default', ['start']);