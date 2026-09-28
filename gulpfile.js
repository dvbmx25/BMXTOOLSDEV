const gulp = require('gulp');

// Copy all static assets to dist folder
function copyStatic() {
  return gulp.src([
    '*.html',
    '*.css',
    '*.js',
    '!gulpfile.js',
    '!package.json',
    '!package-lock.json'
  ], { base: '.' })
    .pipe(gulp.dest('dist'));
}

// Build task (default export)
exports.build = gulp.series(copyStatic);
