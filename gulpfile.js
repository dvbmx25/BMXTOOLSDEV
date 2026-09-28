const gulp = require('gulp');
const replace = require('gulp-replace');

function copyStatic() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

  return gulp.src([
    '*.html',
    '*.css',
    '*.js',
    '!gulpfile.js',
    '!package.json',
    '!package-lock.json'
  ], { base: '.' })
    .pipe(replace('__SUPABASE_URL__', supabaseUrl))
    .pipe(replace('__SUPABASE_ANON_KEY__', supabaseKey))
    .pipe(gulp.dest('dist'));
}

exports.build = gulp.series(copyStatic);
