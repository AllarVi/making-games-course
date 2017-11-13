const watchify = require('watchify')
const browserify = require('browserify')
const gulp = require('gulp')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const gutil = require('gulp-util')
const sourcemaps = require('gulp-sourcemaps')
const assign = require('lodash.assign')
const jshint = require('gulp-jshint')
const browserSync = require('browser-sync').create()

// add custom browserify options here
const customOpts = {
	entries: ['src/main.js'],
	debug: true,
}
const opts = assign({}, watchify.args, customOpts)
const b = watchify(browserify(opts))

function bundle() {
	return b.bundle()
	// log errors if they happen
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		// optional, remove if you don't need to buffer file contents
		.pipe(buffer())
		// optional, remove if you dont want sourcemaps
		.pipe(sourcemaps.init({
			loadMaps: true,
		})) // loads map from browserify file
		// Add transformation tasks to the pipeline here.
		.pipe(sourcemaps.write('./')) // writes .map file
		.pipe(gulp.dest('./dist'))
}

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle) // so you can run `gulp js` to build the file
b.on('update', bundle) // on any dep update, runs the bundler
b.on('log', gutil.log) // output build logs to terminal
b.transform('babelify', { presets: ['es2015'] })

gulp.task('hint', () => {
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
})

// Static server
gulp.task('browser-sync', () => {
	browserSync.init({
		server: {
			baseDir: './dist',
		},
	})

	gulp.watch('dist/bundle.js').on('change', browserSync.reload)
})

gulp.task('build', ['hint', 'js', 'browser-sync'])
