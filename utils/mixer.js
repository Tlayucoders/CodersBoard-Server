const gulp = require('gulp');
const stylus = require('gulp-stylus');
const notify = require('gulp-notify');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const rollupPluginCommonjs = require ('rollup-plugin-commonjs');
const alias = require ('rollup-plugin-alias');
const rollupPluginVue = require ('rollup-plugin-vue');
const replace = require ('rollup-plugin-replace');
const multiEntry = require ('rollup-plugin-multi-entry');

class Mix {
    /**
     * Compile vue js files to iife
     */
    vue(input, output) {
        rollup.rollup({
            entry: input,
            plugins: [
                resolve(),
                multiEntry(),
                rollupPluginCommonjs(),
                rollupPluginVue(),
                alias({
                    'vue': 'vue/dist/vue.esm.js'
                }),
                replace({
                    'process.env.NODE_ENV': process.env.NODE_ENV || 'development'
                })
            ]
        })
        .then(bundle => {
            bundle.write({
                format: 'iife',
                moduleName: 'library',
                dest: output,
                sourceMap: true
            });
        });

        return this;
    }

    css(input, output) { // eslint-disable-line
        return this;
    }

    /**
     * Compile Stylus o css
     */
    stylus(input, output) {
        gulp.task('stylus', () => {
            console.log('task');
            return gulp.src(input)
                .pipe(notify({ message: `Building ${input} to ${output}` }))
                .pipe(stylus({
                    compress: true,
                    'include css': true
                }))
                .pipe(gulp.dest(output))
                .pipe(notify({ message: 'Build stylus finish.' }));
        });

        return this;
    }

    copy(input, output) { // eslint-disable-line
        return this;
    }
}

module.exports =  new Mix();
