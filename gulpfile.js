const gulp = require('gulp');
const prompt = require('gulp-prompt');
const argv = require('yargs').argv;

const config = require('./gulp/config');
const application = require('./gulp/application');
const documentation = require('./gulp/documentation');
const themes = require('./gulp/themes');
const common = require('./gulp/common');
const libraries = require('./gulp/libraries');
const components = require('./gulp/components');
const publish = require('./gulp/publish');

/*****************************************************************************************************
 * Generate all distribution (production, development) and development (in-memory)                   *
 * tasks for themes's libraries                                                                      *
 *****************************************************************************************************/
themes.generateTasks(true, true, 'production');
//gulp.task('theme:dist:prod:all', gulp.parallel(config.libsThemeTasks));
gulp.task('theme:dist:prod:all', done=>{
  config.libsThemeTasks;
  done();
});
//gulp.task('theme:dist:prod:all:res:copy', gulp.parallel(config.libsThemeCopyToResourcesTasks));
gulp.task('theme:dist:prod:all:res:copy', done=>{
  config.libsThemeCopyToResourcesTasks;
  done();
});
themes.generateTasks(true, false, 'development');
//gulp.task('theme:dist:dev:all', gulp.parallel(config.libsThemeTasks));
gulp.task('theme:dist:dev:all', done=>{
  config.libsThemeTasks;
  done();
});
//gulp.task('theme:dist:dev:all:res:copy', gulp.parallel(config.libsThemeCopyToResourcesTasks));
gulp.task('theme:dist:dev:all:res:copy', done=>{
  config.libsThemeCopyToResourcesTasks;
  done();
});
themes.generateTasks(false, false, 'memory');
//gulp.task('theme:mem:all', gulp.series(config.libsThemeTasks));
gulp.task('theme:mem:all', done=>{
  config.libsThemeTasks;
  done();
});
gulp.task('theme:dist:all', gulp.parallel('theme:dist:prod:all', 'theme:dist:dev:all'));


/*****************************************************************************************************
 * Generate all distribution (production, development) and development (in-memory)                   *
 * tasks for js's libraries                                                                          *
 *****************************************************************************************************/
libraries.generateTasks(true, true, 'production');
//gulp.task('lib:dist:prod:all', gulp.parallel(config.libsJsTasks));
gulp.task('lib:dist:prod:all', done=>{
  config.libsJsTasks;
  done();
});
//gulp.task('lib:dist:prod:all:res:copy', gulp.parallel(config.libsJsCopyToResourcesTasks));
gulp.task('lib:dist:prod:all:res:copy', done=>{
  config.libsJsCopyToResourcesTasks;
  done();
});
libraries.generateTasks(true, false, 'development');
//gulp.task('lib:dist:dev:all', gulp.parallel(config.libsJsTasks));
gulp.task('lib:dist:dev:all', done=>{
  config.libsJsTasks;
  done();
});
//gulp.task('lib:dist:dev:all:res:copy', gulp.parallel(config.libsJsCopyToResourcesTasks));
gulp.task('lib:dist:dev:all:res:copy', done=>{
  config.libsJsCopyToResourcesTasks;
  done();
});
libraries.generateTasks(false, false, 'memory');
//gulp.task('lib:mem:all', gulp.series(config.libsJsTasks));
gulp.task('lib:mem:all', done=>{
  config.libsJsTasks;
  done();
});
gulp.task('lib:dist:all', gulp.parallel('lib:dist:prod:all', 'lib:dist:dev:all'));

/*****************************************************************************************************
 * Generate all distribution (production, development) and development (in-memory)                   *
 * tasks for components                                                                              *
 *****************************************************************************************************/
components.generateTasks(true, true, 'production');
//gulp.task('compt:dist:prod:all', gulp.parallel(config.componentsTasks));
gulp.task('compt:dist:prod:all', done=>{
  config.componentsTasks;
  done();
});
//gulp.task('compt:dist:prod:all:res:copy', gulp.parallel(config.componentsCopyToResourcesTasks));
gulp.task('compt:dist:prod:all:res:copy', done=>{
  config.componentsCopyToResourcesTasks;
  done();
});
components.generateTasks(true, false, 'development');
//gulp.task('compt:dist:dev:all', gulp.parallel(config.componentsTasks));
gulp.task('compt:dist:dev:all', done=>{
  config.componentsTasks;
  done();
});
//gulp.task('compt:dist:dev:all:res:copy', gulp.parallel(config.componentsCopyToResourcesTasks));
gulp.task('compt:dist:dev:all:res:copy', done=>{
  config.componentsCopyToResourcesTasks;
  done();
});
components.generateTasks(false, false, 'memory');
//gulp.task('compt:mem:all', gulp.series(config.componentsTasks));
gulp.task('compt:mem:all', done=>{
  config.componentsTasks;
  done();
});


gulp.task('compt:dist:all', gulp.parallel('compt:dist:prod:all', 'compt:dist:dev:all'));

documentation.generateTasks();

application.generateTasks();

publish.generateTasks();

/*****************************************************************************************************
 * Watch sources for app, libraries and components, only for in-memory development                   *
 *****************************************************************************************************/
gulp.task('watch:mem', (cb) => {
  gulp.watch(`src/webapp/**/*`, gulp.series('app:mem:build', 'bs:reload'));
  config.libsTheme.forEach((lib) => {
    gulp.watch(`${config.srcThemesPath}/${lib.name}/src/${lib.path}/**/*.less`,
      gulp.series(`theme:memory:${lib.name}:build:css`,'bs:reload'));
    gulp.watch(`${config.srcThemesPath}/${lib.name}/src/${lib.path}/**/*-preload.js`,
      gulp.series(`theme:memory:${lib.name}:build:preload`,'bs:reload'));
    gulp.watch(`${config.srcThemesPath}/${lib.name}/themes/**/*`,
      gulp.series(`theme:memory:${lib.name}:themes`,'bs:reload'));
  });
  config.libsJs.forEach((lib) => {
    gulp.watch([`${config.srcLibsPath}/${lib.name}/src/${lib.path}/**/*`, `!${config.srcLibsPath}/${lib.name}/src/${lib.path}/**/*.js`],
      gulp.series(`lib:memory:${lib.name}:build:other`, 'bs:reload'));
    gulp.watch(`${config.srcLibsPath}/${lib.name}/src/${lib.path}/**/*.js`,
      gulp.series(`lib:memory:${lib.name}:build:js`, 'bs:reload'));
    gulp.watch(`${config.srcLibsPath}/${lib.name}/themes/**/*`,
      gulp.series(`lib:memory:${lib.name}:themes`, 'bs:reload'));
  });
  config.components.forEach((compts) => {
    gulp.watch([
        `${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*`,
        `!${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*js`,
        `!${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*json`,
        `!${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*html`,
        `!${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*xml`,
      ],
      gulp.series(`compt:memory:${compts.name}:build:other`, 'bs:reload'));
    gulp.watch(`${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*.js`,
      gulp.series(`compt:memory:${compts.name}:build:js`, 'bs:reload'));
    gulp.watch(`${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*.xml`,
      gulp.series(`compt:memory:${compts.name}:build:xml`, 'bs:reload'));
    gulp.watch(`${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*.html`,
      gulp.series(`compt:memory:${compts.name}:build:html`, 'bs:reload'));
    gulp.watch(`${config.srcComponentsPath}/${compts.name}/src/${compts.path}/**/*.json`,
      gulp.series(`compt:memory:${compts.name}:build:json`, 'bs:reload'));
  });
  cb();
});

/*****************************************************************************************************
 * Live in-memory development [in-memory build of libraries/components, in-memory build              *
 * of app, start server, watch sources of app/libraries/components]                                  *
 *****************************************************************************************************/
gulp.task('live:mem',
  gulp.series([
    'app:clean',
    'theme:mem:all', 'lib:mem:all', 'compt:mem:all',
    'app:mem:build',
    'bs:mem:start',
    'watch:mem']));

/*****************************************************************************************************
 * Live production distribution [production distribution build of libraries/components,              *
 * copy built resources of libraries/components, app build, start server]                            *
 *****************************************************************************************************/
gulp.task('live:dist:prod',
  gulp.series([
    'app:clean',
    'theme:dist:prod:all', 'lib:dist:prod:all', 'compt:dist:prod:all',
    'theme:dist:prod:all:res:copy', 'lib:dist:prod:all:res:copy', 'compt:dist:prod:all:res:copy',
    'app:dist:prod:build',
    'bs:dist:start']));

/*****************************************************************************************************
 * Live development distribution [development distribution build libraries/components,               *
 * copy built resources of libraries/components, app build, start server]                            *
 *****************************************************************************************************/
gulp.task('live:dist:dev',
  gulp.series([
    'app:clean',
    'theme:dist:dev:all', 'lib:dist:dev:all', 'compt:dist:dev:all',
    'theme:dist:dev:all:res:copy', 'lib:dist:dev:all:res:copy', 'compt:dist:dev:all:res:copy',
    'app:dist:dev:build',
    'bs:dist:start']));

/*****************************************************************************************************
 * Live in-memory development [production/development distribution build of                          *
 * libraries/components, in-memory build of libraries/components, in-memory buid of                  *
 * app, start server, watch sources of app/libraries/components]                                     *
 *****************************************************************************************************/
gulp.task('default', gulp.series('theme:dist:all', 'lib:dist:all', 'compt:dist:all', 'live:mem'));

const showBuildHelpInfo = () => {
  const libs = config.libsJs.map((lib) => lib.name);
  const themes = config.libsTheme.map((lib) => lib.name);
  const compts = config.components.map((lib) => lib.name);
  common.log(`Probably you forgot to pass parameters:`.green);
  common.log('    --dist {distributionType}, possible values '.yellow + 'development,production'.blue);
  common.log('and'.yellow);
  common.log(`    --lib {libraryName}, possible values `.yellow + `${libs}`.blue);
  common.log(`    --theme {themeName}, possible values `.yellow + `${themes}`.blue);
  common.log(`    --compt {componentName}, possible values `.yellow + `${compts}`.blue);
  common.log('NOTE: only first specified parameter of --lib, --theme, --compt will be taken'.green);
  common.log('EXAMPLE: gulp build --dist=production --lib=gk.core'.green);
  common.log('EXAMPLE: gulp build --dist=development --theme=gk.theme.base'.green);
  common.log('EXAMPLE: gulp build --dist=production --compt=gk.numpad'.green);
};

const showDocHelpInfo = () => {
  const libs = config.libsJs.map((lib) => lib.name);
  const themes = config.libsTheme.map((lib) => lib.name);
  const compts = config.components.map((lib) => lib.name);
  common.log(`Probably you forgot to pass parameters:`.green);
  common.log(`    --lib {libraryName}, possible values `.yellow + `${libs}`.blue);
  common.log(`    --theme {themeName}, possible values `.yellow + `${themes}`.blue);
  common.log(`    --compt {componentName}, possible values `.yellow + `${compts}`.blue);
  common.log('NOTE: only first specified parameter of --lib, --theme, --compt will be taken'.green);
  common.log('EXAMPLE: gulp doc --lib=gk.core'.green);
  common.log('EXAMPLE: gulp doc --theme=gk.theme.symphony'.green);
  common.log('EXAMPLE: gulp doc --compt=gk.txpreview'.green);
};

const showPublishHelpInfo = () => {
  const libs = config.libsJs.map((lib) => lib.name);
  const themes = config.libsTheme.map((lib) => lib.name);
  const compts = config.components.map((lib) => lib.name);
  common.log(`Probably you forgot to pass parameters:`.green);
  common.log(`    --lib {libraryName}, possible values `.yellow + `${libs}`.blue);
  common.log(`    --theme {themeName}, possible values `.yellow + `${themes}`.blue);
  common.log(`    --compt {componentName}, possible values `.yellow + `${compts}`.blue);
  common.log('NOTE: only first specified parameter of --lib, --theme, --compt will be taken'.green);
  common.log('EXAMPLE: gulp publish --lib=gk.core'.green);
  common.log('EXAMPLE: gulp publish --theme=gk.theme.symphony'.green);
  common.log('EXAMPLE: gulp publish --compt=gk.txpreview'.green);
};

if (argv._[0] === 'build' && (!argv.dist || (!argv.lib && !argv.theme && !argv.compt))) {
  showBuildHelpInfo();
} else if (argv._[0] === 'build') {
  if (argv.lib && config.libsJs.filter((lib) => lib.name === argv.lib).length) {
    gulp.task('build', gulp.series(`lib:${argv.dist}:${argv.lib}`));
    return;
  }
  if (argv.theme && config.libsTheme.filter((lib) => lib.name === argv.theme).length) {
    gulp.task('build', gulp.series(`theme:${argv.dist}:${argv.theme}`));
    return;
  }
  if (argv.compt && config.components.filter((lib) => lib.name === argv.compt).length) {
    gulp.task('build', gulp.series(`compt:${argv.dist}:${argv.compt}`));
    return;
  }
  showBuildHelpInfo();
}

if (argv._[0] === 'doc' && (!argv.lib && !argv.theme && !argv.compt)) {
  showDocHelpInfo();
} else if (argv._[0] === 'doc') {
  if (argv.lib && config.libsJs.filter((lib) => lib.name === argv.lib).length) {
    gulp.task('doc', gulp.series(`lib:dist:${argv.lib}:doc`));
    return;
  }
  if (argv.theme && config.libsTheme.filter((lib) => lib.name === argv.theme).length) {
    gulp.task('doc', gulp.series(`theme:dist:${argv.theme}:doc`));
    return;
  }
  if (argv.compt && config.components.filter((lib) => lib.name === argv.compt).length) {
    gulp.task('doc', gulp.series(`compt:dist:${argv.compt}:doc`));
    return;
  }
  showDocHelpInfo();
}

if (argv._[0] === 'publish' && (!argv.lib && !argv.theme && !argv.compt)) {
  showPublishHelpInfo();
} else if (argv._[0] === 'publish') {
  if (argv.lib && config.libsJs.filter((lib) => lib.name === argv.lib).length) {
    gulp.task('publish', gulp.series(`lib:dist:${argv.lib}:publish`));
    return;
  }
  if (argv.theme && config.libsTheme.filter((lib) => lib.name === argv.theme).length) {
    gulp.task('publish', gulp.series(`theme:dist:${argv.theme}:publish`));
    return;
  }
  if (argv.compt && config.components.filter((lib) => lib.name === argv.compt).length) {
    gulp.task('publish', gulp.series(`compt:dist:${argv.compt}:publish`));
    return;
  }
  showPublishHelpInfo();
}

let answers = {
  operation: undefined,
  typeOfLivePreview: undefined,
  distributionType: 'all',
  packageType: undefined,
  packageName: undefined
};

const chooseOperation = () => {
  return gulp.src('package.json')
    .pipe(prompt.prompt([{
      type: 'list',
      name: 'operation',
      message: 'Which type of operation would you like to do?',
      choices: ['live', 'build', 'document', 'publish']
    }], (res) => {
      answers.operation = res.operation;
      answers.operation === 'live' ? chooseTypeOfLivePreview() : {};
      answers.operation === 'build' ? chooseDistributionType() : {};
      answers.operation === 'document' ? choosePackageType() : {};
      answers.operation === 'publish' ? choosePackageType() : {};
    }));
};

const chooseTypeOfLivePreview = () => {
  return gulp.src('package.json')
    .pipe(prompt.prompt([{
      type: 'list',
      name: 'typeOfLivePreview',
      message: 'Which type of demo would you like to start?',
      default: 'in-memory development',
      choices: ['production distribution', 'development distribution', 'in-memory development']
    }], (res) => {
      if (res.typeOfLivePreview === 'production distribution') answers.typeOfLivePreview = 'dist:prod';
      if (res.typeOfLivePreview === 'development distribution') answers.typeOfLivePreview = 'dist:dev';
      if (res.typeOfLivePreview === 'in-memory development') answers.typeOfLivePreview = 'mem';
      common.log(`Command will be: `.blue + `gulp ${answers.operation}:${answers.typeOfLivePreview}`.green)
    }));
};

const choosePackageType = () => {
  return gulp.src('package.json')
    .pipe(prompt.prompt([{
      type: 'list',
      name: 'packageType',
      message: `Which type of package would you like to ${answers.operation}?`,
      default: 'theme',
      choices: ['component', 'library', 'theme']
    }], (res) => {
      if (res.packageType === 'component') answers.packageType = 'compt';
      if (res.packageType === 'library') answers.packageType = 'lib';
      if (res.packageType === 'theme') answers.packageType = 'theme';
      choosePackageName();
    }));
};

const chooseDistributionType = () => {
  return gulp.src('package.json')
    .pipe(prompt.prompt([{
      type: 'list',
      name: 'distributionType',
      message: `Which type of package distribution would you like to ${answers.operation}?`,
      choices: ['development', 'production', 'all']
    }], (res) => {
      answers.distributionType = res.distributionType;
      choosePackageType();
    }));
};

const choosePackageName = () => {
  let choices;
  if (answers.packageType === 'theme') choices = config.libsTheme.map((theme) => theme.name);
  if (answers.packageType === 'lib') choices = config.libsJs.map((lib) => lib.name);
  if (answers.packageType === 'compt') choices = config.components.map((compt) => compt.name);
  return gulp.src('package.json')
    .pipe(prompt.prompt([{
      type: 'list',
      name: 'packageName',
      message: `Which ${answers.package} would you like to ${answers.operation}?`,
      choices: choices,
      validate: function(packageName){
        return packageName;
      }
    }], (res) => {
      answers.packageName = res.packageName;
      common.log(`Command will be: `.red + `gulp ${answers.operation} --dist=${answers.distributionType} --${answers.packageType}=${answers.packageName}`.green)
    }));
};

gulp.task('helpme', (cb) => {
  chooseOperation();
  cb()
});
