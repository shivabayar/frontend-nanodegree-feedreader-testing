const {parallel, src, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const jasmineBrowser = require('gulp-jasmine-browser');


function browserSyncTask(cb) {
    cb();
    browserSync.init({
        server: "./"
    });
    watch(['js/**/*.js', 'jasmine/**/*.js'], function(cb) {
        // body omitted
        cb();
    })
    .on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
        browserSync.reload();
    });    
}

function eslintTask(cb) {
    cb();
    watch('js/**/*.js', function(cb) {
        src('js/**/*.js')
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());
    });
}

function testsTask(cb) {
    cb();
    src('jasmine/spec/feedreader.js')
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.headless({ driver: 'chrome' }));
}

  
exports.default = parallel(eslintTask, browserSyncTask);
exports.tests = series(testsTask);