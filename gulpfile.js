// Plugins
require('es6-promise').polyfill();
var gulp = require('gulp'),

    // Styles
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    minify = require('gulp-clean-css'),
    rename = require('gulp-rename'),

    // Scripts
    uglify = require('gulp-uglify'),
    strip = require('gulp-strip-debug'),
    concat = require('gulp-concat'),
    include = require('gulp-include'),

    // Other
    util = require('gulp-util'),
    del = require('del'),
    notify = require('gulp-notify'),
    notifier = require('node-notifier'),
    merge = require('merge-stream'),
    sequence = require('run-sequence'),
    combinemq = require('gulp-combine-mq');



// Errors
var logErrors = function (error) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.'
    }).write(error);

    console.log('Description: ' + error.message);
    console.log('In file: ' + error.fileName + ', on line: ' + error.lineNumber );

    this.emit('end');
}

/* -------------------------
    Tasks
------------------------- */

// Styles
gulp.task('styles', function() {

    var production = ['build','deploy'].indexOf(this.seq.slice(-1)[0]) !== -1;

    return gulp.src('assets/sass/**/*.scss')
        .pipe(sass({sourceComments: 'normal'}))
        .on('error', logErrors)
        .pipe(autoprefix({browsers: 'last 4 versions'}))
        .pipe(production ? minify() : util.noop())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/css'))
});

// Scripts
gulp.task('scripts', function() {

    var production = ['build','deploy'].indexOf(this.seq.slice(-1)[0]) !== -1;

    return gulp.src('assets/js/src/*.js')
        .pipe(include()).on('error', console.log)
        .pipe(production ? strip() : util.noop())
        .pipe(production ? uglify() : util.noop())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/js'));
});

// Watch
gulp.task('watch', function() {
    gulp.watch('assets/sass/**/*.scss', ['styles']);
    gulp.watch('assets/js/**/*.js', ['scripts']);
});

// Default
gulp.task('default', function(callback) {
    sequence(
        ['styles', 'scripts'],
        'watch',
        callback);

    notifier.notify({message: 'Tasks complete'});
});

/* -------------------------
    Build
------------------------- */

// Define build files
var build = {

    // Ignore files we don't need
    files: [
        '**/*',
        '!{_build,_build/**}',
        '!{vendor,vendor/**}',
        '!{assets/sass,assets/sass/**}',
        '!{assets/js/lib,assets/js/lib/**,assets/js/src,assets/js/src/**,assets/js/vendor,assets/js/vendor/**}',
        '!{templates,templates/**}',
        '!{node_modules,node_modules/**}',
        '!package.json',
        '!hostconfig.json',
        '!gulpfile.js',
        '!composer.json',
        '!composer.lock',
        '!README.md'
    ],

}

// Build task
gulp.task('build', ['styles', 'scripts' ], function() {
    gulp.src(build.files, {base: '.'})
        .pipe(gulp.dest('_build'));
});