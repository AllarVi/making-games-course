'use strict'

let watchify = require('watchify')
let browserify = require('browserify')
let gulp = require('gulp')
let source = require('vinyl-source-stream')
let buffer = require('vinyl-buffer')
let gutil = require('gulp-util')
let sourcemaps = require('gulp-sourcemaps')
let assign = require('lodash.assign')
let jshint = require('gulp-jshint')
let browserSync = require('browser-sync').create()

// add custom browserify options here
let customOpts = {
  entries: ['src/main.js'],
  debug: true
}
let opts = assign({}, watchify.args, customOpts)
let b = watchify(browserify(opts))

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle) // so you can run `gulp js` to build the file
b.on('update', bundle) // on any dep update, runs the bundler
b.on('log', gutil.log) // output build logs to terminal
b.transform('babelify', {presets: ['es2015']})

function bundle () {
  return b.bundle()
  // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({
      loadMaps: true
    })) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'))
}

gulp.task('hint', function () {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

// Static server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })

  gulp.watch('dist/bundle.js').on('change', browserSync.reload)
})

gulp.task('build', ['hint', 'js', 'browser-sync'])