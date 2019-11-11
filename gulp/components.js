const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const insert = require('gulp-insert');
const ui5preload = require('gulp-ui5-preload');
const stringify = require('stringify-object');

const config = require('./config');
const common = require('./common');

/*****************************************************************************************************
 * The function creates and gets Component-preload.js file as an output                              *
 *****************************************************************************************************/
const copyComponentPreload = (opts) => {
  common.log(`Generating Component-preload.js for ${opts.name} ...`.green);
  console.log(stringify(opts, { indent: '  ', singleQuotes: false }).yellow);
  const comptNamespace = opts.packageType === 'memory' ? 'stub' : opts.path;
  return merge(common.copy(opts), common.copyJs(opts))
    .pipe(ui5preload({base: `${common.getSrcPath(opts)}`, namespace: comptNamespace}))
    .pipe(insert.prepend(common.getDistPackageHeader()))
};

/*****************************************************************************************************
 * The function generates all distribution (development and production) tasks (clean,                *
 * build, stubs, preload) for components that are defined in the config                              *
 *****************************************************************************************************/
const generateTasks = (isDist, isUglify, packageType) => {
  config.componentsTasks = [];
  config.componentsCopyToResourcesTasks = [];
  config.components.forEach((component) => {
    let opts = {
      type: 'compt',
      srcPath: config.srcComponentsPath,
      name: component.name,
      path: component.path,
      isDist: isDist,
      isUglify: isUglify,
      packageType: packageType
    };
    gulp.task(common.cleanTask(opts), () => del(common.destPath(opts)));
    gulp.task(`${common.buildTask(opts)}:other`, () => {
      return common.copyOther(opts)
        .pipe((isDist ? gulp : config.gulpMem).dest(`${common.destPath(opts)}/${opts.path}`))
    });
    gulp.task(`${common.buildTask(opts)}:js`, () => {
      return common.copyJs(opts)
        .pipe((isDist ? gulp : config.gulpMem).dest(`${common.destPath(opts)}/${opts.path}`))
    });
    gulp.task(`${common.buildTask(opts)}:xml`, () => {
      return common.copyXml(opts)
        .pipe((isDist ? gulp : config.gulpMem).dest(`${common.destPath(opts)}/${opts.path}`))
    });
    gulp.task(`${common.buildTask(opts)}:json`, () => {
      return common.copyJson(opts)
        .pipe((isDist ? gulp : config.gulpMem).dest(`${common.destPath(opts)}/${opts.path}`))
    });
    gulp.task(`${common.buildTask(opts)}:html`, () => {
      return common.copyHtml(opts)
        .pipe((isDist ? gulp : config.gulpMem).dest(`${common.destPath(opts)}/${opts.path}`))
    });
    gulp.task(`${common.buildTask(opts)}:preload`, () => {
      return merge(copyComponentPreload(opts), gulp.src(`${common.getSrcPath(opts)}/manifest.json`))
        .pipe((isDist ? gulp : config.gulpMem).dest(`${common.destPath(opts)}/${opts.path}`))
    });
    gulp.task(common.buildTask(opts), gulp.series(
      `${common.buildTask(opts)}:other`,
      `${common.buildTask(opts)}:js`,
      `${common.buildTask(opts)}:xml`,
      `${common.buildTask(opts)}:json`,
      `${common.buildTask(opts)}:html`,
      `${common.buildTask(opts)}:preload`
    ));
    if (isDist) {
      gulp.task(common.copyResTask(opts), () => {
        return gulp.src(`${common.destPath(opts)}/**/*`)
          .pipe(gulp.dest(config.distPath))
      });
      config.componentsCopyToResourcesTasks.push(common.copyResTask(opts));
      gulp.task(common.mainTask(opts), gulp.series(common.cleanTask(opts), `${common.buildTask(opts)}:preload`))
    } else {
      gulp.task(common.mainTask(opts), gulp.series(common.cleanTask(opts), common.buildTask(opts)))
    }
    config.componentsTasks.push(common.mainTask(opts))
  })
};

module.exports = {
  generateTasks: generateTasks
};
