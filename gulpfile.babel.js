/**
 * Import Gulp Modules
 */
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import sass from 'gulp-sass';

/**
 * Import properties from the gulp config
 * 
 * Makes use of ES6 destructuring to import 
 * specific properties, rather than the whole
 * object.
 * 
 * import { prop } from { "prop": true }
 * 
 * is the same as:
 * 
 * var config = { "prop": true }
 * var prop = config.prop
 */
import { assets, npm, src } from './gulp.config.json';

/**
 * SASS Gulp Task
 * 
 * Run main SASS file though the SASS 
 * compiler, run Autoprefixer on the 
 * resulting CSS to improve browser 
 * compatibility, then output the CSS 
 * into the assets directory.
 */
gulp.task('sass', () => {
    return gulp.src(`${src}/sass/main.sass`)
               .pipe(sass({
                   style: 'expanded',
               }))
               .pipe(autoprefixer(
                   ['last 15 versions', '>1%', 'ie 8', 'ie 7'],
                   { cascade: true }
               ))
               .pipe(gulp.dest(`${assets}/css`));
});

/**
 * JS Gulp Task
 * 
 * Take JS files from all added libraries, 
 * and custom JS files, concatenate the files, 
 * run the concatenated script through the 
 * Babel compiler, output the compiled JS into 
 * the assets directory.
 */
gulp.task('js', () => {
    return gulp.src([
                    `${npm}/jquery/dist/jquery.min.js`,
                    `${npm}/bootstrap/dist/js/bootstrap.bundle.min.js`,
                    `${src}/js/scripts.js`
                ])
               .pipe(concat('scripts.js'))
               .pipe(babel({
                   presets: ['env']
               }))
               .pipe(gulp.dest(`${assets}/js`));
});

/**
 * Images Gulp Task
 * 
 * Copies images from src directory 
 * to assets directory.
 */
gulp.task('img', () => {
    return gulp.src(`${src}/img/**/*`)
               .pipe(gulp.dest(`${assets}/img`));
});

/**
 * Watch Gulp Task
 * 
 * Watch files in the given directories 
 * and run the associated gulp task when 
 * a change is detected.
 */
gulp.task('watch', () => {
    /**
     * The asterisks used in the file paths
     * beneath will watch for changes to files 
     * within the root directory specified, and 
     * any subdirectories. This makes it easier 
     * to have modular SASS files, or to organise 
     * images into folders.
     * 
     * "*.scss" matches any file name that has 
     * the .scss extension. Likewise, "*.js" 
     * matches all file names with the .js 
     * extension.
     */
    gulp.watch(`${src}/sass/**/*.scss`, ['sass']);
    gulp.watch(`${src}/js/**/*.js`, ['js']);
    gulp.watch(`${src}/img/**/*`, ['img']);
});

/**
 * Default Gulp Task
 * 
 * A gulp task with the name "default", will be run
 * if "gulp" is run in the terminal without any task
 * specified.
 * 
 * The array given as the second argument lists tasks
 * for the task to run. Gulp should run the SASS, JS 
 * and Img tasks first, to ensure that those assets 
 * are up to date, before it begins watching their 
 * respective directories for file changes.
 */
gulp.task('default', ['sass', 'js', 'img', 'watch']);