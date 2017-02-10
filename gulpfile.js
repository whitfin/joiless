var dv = require('dep-validate');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var path = require('path');
var rs = require('run-sequence');

var pkg = path.join(__dirname, 'package.json');

gulp.task('default', ['ci']);

gulp.task('ci', function (done) {
  rs('validate', 'test', done);
});

gulp.task('deps:validate', function () {
  gulp
    .src(pkg, { read: false })
    .pipe(dv.gulp({ allowHardcoded: false, failOnError: true }));
});

gulp.task('lint', function () {
  gulp
    .src([ '**/*.js', '!node_modules*/**' ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function () {
  gulp
    .src('test/**/*.js')
    .pipe(mocha({ reporter: 'spec', ui: 'tdd' }));
});

gulp.task('validate', function (done) {
  rs('deps:validate', 'lint', done);
});
