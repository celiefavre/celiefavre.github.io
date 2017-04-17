var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var notify      = require('gulp-notify');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var gutil       = require('gulp-util');
var ftp         = require('vinyl-ftp');
var sourcemaps = require('gulp-sourcemaps');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function () {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
  return gulp.src('./_sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['sass/**/index.scss', 'bower_components/susy/sass/susy'],
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('_site/css'))
    .pipe(notify('sass compilé'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('css'));
});

// compress js

gulp.task('compress', function () {
  return gulp.src('js/main.js')
    .pipe(uglify({
      onError: browserSync.notify
    }))
    .pipe(gulp.dest('_site/js'))
    .pipe(notify('js minifié'))
    .pipe(browserSync.reload({stream: true}));
});

// deploy ftp
gulp.task('deploy', function () {

  var conn = ftp.create({
    host: '85.236.157.164', user: 'psyemdr', password: 'gqz7dc2demeter2', parallel: 20, log: gutil.log
  });

  var globs = [
    './_site/css/main.css',
    './_site/js/*.js',
    './_site/**/*.html',
    './_site/images/*',
    './_site/fonts/*',
    './_site/robots.txt'];
  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance
  return gulp.src(globs, {base: './', buffer: false})
    .pipe(conn.differentSize('/public_html/')) // only upload newer files
    .pipe(conn.dest('/public_html/'));

});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch('_sass/**/*.scss', ['sass']);
  gulp.watch('js/main.js', ['compress']);
  gulp.watch(['index.html', '**/*.html', '_layouts/*.html', '_posts/*', '_includes/*.html'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
