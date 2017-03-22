const gulp = require('gulp');
const mix = require('./utils/mixer');

mix.stylus([
    'resources/stylus/app.styl'
], 'public/css/app.css')
.vue([
    'resources/assets/js/app.js'
], 'public/js/app.js');

gulp.task('build', mix.tasks);
