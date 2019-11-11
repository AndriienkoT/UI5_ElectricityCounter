const gulp = require('gulp');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const uglifyjs = require('gulp-uglify');
const colors = require('colors');
const dateFormat = require('dateformat');

/*****************************************************************************************************
 * The function collects files that are not need to be compiled                                      *
 *****************************************************************************************************/
const copy = (opts) => {
  return gulp.src([
    `${getSrcPath(opts)}/**/*`,
    `!${getSrcPath(opts)}/**/*js`
  ])
};

/*****************************************************************************************************
 * The function collects files that are not need to be compiled except (js, json, html, xml)         *
 *****************************************************************************************************/
const copyOther = (opts) => {
  return gulp.src([
    `${getSrcPath(opts)}/**/*`,
    `!${getSrcPath(opts)}/**/*js`,
    `!${getSrcPath(opts)}/**/*json`,
    `!${getSrcPath(opts)}/**/*html`,
    `!${getSrcPath(opts)}/**/*xml`,
  ])
};

/*****************************************************************************************************
 * The function collects all json files                                                              *
 *****************************************************************************************************/
const copyJson = (opts) => {
  return gulp.src([
    `${getSrcPath(opts)}/**/*.json`
  ])
};

/*****************************************************************************************************
 * The function collects all xml files                                                              *
 *****************************************************************************************************/
const copyXml = (opts) => {
  return gulp.src([
    `${getSrcPath(opts)}/**/*.xml`
  ])
};

/*****************************************************************************************************
 * The function collects all html files                                                              *
 *****************************************************************************************************/
const copyHtml = (opts) => {
  return gulp.src([
    `${getSrcPath(opts)}/**/*.html`
  ])
};

/*****************************************************************************************************
 * The function collects files that are needed for openui5's libraries                               *
 *****************************************************************************************************/
const copyThemes = (opts) => {
  return gulp.src([`${getThemesPath(opts)}/**/*`])
};

/*****************************************************************************************************
 * The function compiles .js files and gets .js files with sourcemaps as an output                   *
 *****************************************************************************************************/
const copyJs = (opts) => {
  let b = babel()
  .on("error", (e) => {
    console.log(e.stack);
    b.end();
  });
  return gulp.src([
    `${getSrcPath(opts)}/**/*js`,
    `!${opts.srcPath}/${opts.name}/src/**/namespace.js`
  ])
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(gulpif(opts.isDist, eslint.failAfterError()))
    .pipe(sourcemaps.init({largeFile: true}))
    .pipe(gulpif(opts.isDist, babel(), b))
    .pipe(replace(`${opts.path}/app`, 'sdk/ui5'))
    .pipe(replace(`${opts.name}.app`, 'sdk.ui5'))
    .pipe(replace(`${opts.srcPath}/${opts.name}/src/`, ''))
    .pipe(replace(`src.libraries.${opts.name}.src.`, ''))
    .pipe(replace(`src.components.${opts.name}.src.`, ''))
    .pipe(gulpif(opts.isUglify, uglifyjs()))
    .pipe(sourcemaps.write())
};

/*****************************************************************************************************
 * Getters of generic pathes for libraries/components                                                *
 *****************************************************************************************************/
const getSrcPath = (opts) => `${opts.srcPath}/${opts.name}/src/${opts.path}`;
const getThemesPath = (opts) => `${opts.srcPath}/${opts.name}/themes`;
const destPath = (opts) => `${opts.srcPath}/${opts.name}/resources/${opts.packageType}`;

/*****************************************************************************************************
 * Getters of generic task names for libraries/components                                            *
 *****************************************************************************************************/
const cleanTask = (opts) => `${opts.type}:${opts.packageType}:${opts.name}:clean`;
const buildTask = (opts) => `${opts.type}:${opts.packageType}:${opts.name}:build`;
const themesTask = (opts) => `${opts.type}:${opts.packageType}:${opts.name}:themes`;
const publishTask = (opts) => `${opts.type}:${opts.packageType}:${opts.name}:publish`;
const copyResTask = (opts) => `${opts.type}:${opts.packageType}:${opts.name}:copy`;
const mainTask = (opts) => `${opts.type}:${opts.packageType}:${opts.name}`;

const log = (message) => console.log(`[${dateFormat(new Date(), 'HH:MM:ss').gray}] gk.sdk.ui5 ${message}`);
const getDistPackageHeader = () => `/***********************\n *     GK SOFTWARE     *\n * ALL RIGHTS RESERVED *\n ************************/\n`;

module.exports = {
  copy: copy,
  copyXml: copyXml,
  copyHtml: copyHtml,
  copyJson: copyJson,
  copyOther: copyOther,
  copyJs: copyJs,
  copyThemes: copyThemes,
  log: log,
  getSrcPath: getSrcPath,
  getDistPackageHeader: getDistPackageHeader,
  cleanTask: cleanTask,
  buildTask: buildTask,
  themesTask: themesTask,
  copyResTask: copyResTask,
  mainTask: mainTask,
  destPath: destPath
};
