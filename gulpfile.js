const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('pugcompile', function buildHTML() {
    return gulp.src('source/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy:images', function() {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('pugcompile'));
    gulp.watch('source/styles/**/*.*', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('pugcompile', 'styles:compile', 'copy'),
    gulp.parallel('watch', 'server')
    )
);
