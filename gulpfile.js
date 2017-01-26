const fs = require('fs');
const gulp = require('gulp');
const sync = require('browser-sync');
const browserify = require('browserify');
const util = require('gulp-util');
const vueify = require('vueify');

gulp.task('compile-js', () => {
  let logPrefix = '[' + util.colors.blue('compile-js') + ']';
  util.log(logPrefix, 'Compiling JS');
  // vueify.compiler.applyConfig({});
  browserify('public/js/main.js')
    .transform(vueify)
    .bundle()
    .pipe(fs.createWriteStream('public/js/app.js'));
});

gulp.task('watch-js', ['compile-js'], (done) => {
  let logPrefix = '[' + util.colors.green('watch-js') + ']';
  util.log(logPrefix, 'JS changed');
  sync.reload();
  done();
});

gulp.task('run', ['compile-js'], () => {
  sync.init({
    proxy: 'http://localhost:3000',
    ws: true
  });
  gulp.watch(['public/js/**/*.js', '!public/js/app.js'], ['watch-js']);
});
