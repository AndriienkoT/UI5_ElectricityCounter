const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const merge = require('merge-stream');
const browserSync = require('browser-sync');

const config = require('./config');

/*****************************************************************************************************
 * Collect minimum set of files from src/webapp for openui5 application                              *
 *****************************************************************************************************/
const appBuild = (packageType) => {
  return merge(
    gulp.src([
      'src/webapp/**/*',
      '!src/webapp/*config.js',
      '!src/webapp/app/manifest.*.json',
      '!src/webapp/**/*js'
    ]),
    gulp.src([
      `src/webapp/app.${packageType}.config.js`
    ])
      .pipe(rename('app.config.js')),
    gulp.src([
      `src/webapp/app/manifest.${packageType}.json`
    ])
      .pipe(rename('app/manifest.json')),
    gulp.src([
      'src/webapp/**/*js',
      '!src/webapp/*config.js'
    ])
      .pipe(eslint({fix: true}))
      .pipe(eslint.format())
      .pipe(sourcemaps.init({largeFile: true}))
      .pipe(babel()
        .on("error", (e) => {
          console.log(e.stack);
          b.end();
        }))
      .pipe(replace(`src/webapp/app`, 'UI5toLearn'))
      .pipe(replace(`src.webapp.app`, 'UI5toLearn'))
      .pipe(sourcemaps.write())
  )
};

/*****************************************************************************************************
 * Start server that serving openui5 application and generated libraries/themes/components resources *
 *****************************************************************************************************/
const startBrowserSync = (isDist) => {
  const middleware = require('../proxies');
  middleware.push(config.gulpMem.middleware);
  browserSync.init({
    middleware: middleware,
    server: [
      `${isDist ? 'target/dist' : '/'}`
    ],
    browser: 'Chromium'
  })
};

const generateTasks = (gulpMem) => {
  gulp.task(`app:clean`, () => {
    return del('target/dist')
  });

  gulp.task(`app:mem:build`, () => {
    return appBuild('memory')
      .pipe(config.gulpMem.dest('/'))
  });

  gulp.task(`app:dist:prod:build`, () => {
    return appBuild('production')
      .pipe(gulp.dest('target/dist'))
  });

  gulp.task(`app:dist:dev:build`, () => {
    return appBuild('development')
      .pipe(gulp.dest('target/dist'))
  });

  gulp.task('bs:mem:start', (done) => {
    startBrowserSync(false, gulpMem);
    done()
  });

  gulp.task('bs:dist:start', (done) => {
    startBrowserSync(true, gulpMem);
    done()
  });

  gulp.task('bs:reload', (done) => {
    browserSync.reload();
    done()
  });
};

module.exports = {
  generateTasks: generateTasks
};
