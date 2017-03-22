const gulp = require('gulp');
const mix = require('./utils/mixer');
const stylus = require('gulp-stylus');
const notify = require('gulp-notify');

gulp.task('build', () => {
    mix.stylus([
        'resources/stylus/app.styl'
    ], 'public/css/app.css')
    .vue([
        'resources/assets/js/app.js'
    ], 'public/js/app.js');
});

gulp.task('stylus', () => {
    return gulp.src('resources/assets/js/app.js')
        .pipe(notify({ message: 'Building resources/assets/js/app.js to public/js/app.js' }))
        .pipe(stylus({
            compress: true,
            'include css': true
        }))
        .pipe(gulp.dest('public/js/app.js'))
        .pipe(notify({ message: 'Build stylus finish.' }));
});

gulp.task('watch', () => {
    const watcher = gulp.watch('resources/assets/**/*.js', ['build']);
    watcher.on('change', (event) => {
        console.log(`File ${event.path} was ${event.type}, running tasks...`); // eslint-disable-line
    });
});
