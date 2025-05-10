'use strict';

/**
 * Dependencies
 */
var gulp = require('gulp');
const sass = require('gulp-dart-sass');
var wrapUMD = require('gulp-wrap-umd');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

/**
 * Directories
 */
var src = {
    sass: 'src/assets/sass',
    js: 'src/app/',
    html: 'src/index.html',
    redirects: 'src/_redirects'
};

var dist = 'dist';

/**
 * Callbacks
 */
function watcherCallback(changedFile) {
    console.log('\n Change saved...', changedFile.path, '\n');
}

function sassCompileCallback() {
    console.log('\n SASS compilation complete. \n');
}

function handleError(err) {
    console.log('\n SASS Error: \n', err.toString());
    this.emit('end');
}

/**
 * Tasks
 */
gulp.task('sass', function () {
    return gulp.src(path.join(src.sass, 'main.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(dist, 'css')))
        .on('error', handleError)
        .on('end', sassCompileCallback);
});

gulp.task('umd', function () {
    return gulp.src(path.join(src.js, 'vendor/THREEOrbitControls/index.js'))
        .pipe(wrapUMD({
            namespace: 'THREE.OrbitControls'
        }))
        .pipe(gulp.dest(path.join(dist, 'js')));
});

gulp.task('html', function () {
    return gulp.src(src.html)
        .pipe(gulp.dest(dist));
});

gulp.task('redirects', function () {
    return gulp.src(src.redirects)
        .pipe(gulp.dest(dist));
});

gulp.task('watch', function () {
    return gulp.watch(src.sass + '/**/*.scss', gulp.series('sass'))
        .on('change', watcherCallback)
        .on('error', handleError);
});

// ✅ Final build task
gulp.task('build', gulp.series('sass', 'umd', 'html', 'redirects'));
