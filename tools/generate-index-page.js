#!/usr/bin/env node
/* jshint node: true */
var path = require('path'),
    fs = require('fs');

var handlebars = require('handlebars'),
    glob = require('glob'),
    async = require('async'),
    chalk = require('chalk'),
    sh = require('shelljs');

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

function loadJson(file) {
  var txt = fs.readFileSync(file, 'utf8');
  return JSON.parse(txt);
}

function getProjectDependencies(includeDevDeps) {
  var bower = require('../bower');

  var deps = Object.keys(bower.dependencies) || [];

  if (includeDevDeps) deps.concat(bower.devDependencies || []);

  return deps;
}

function getCustomBowerIncludes() {
  var bower = require('../bower');
  return bower.includes || [];
}

function getVendorDir() {
  var json = loadJson(path.join(__dirname, '..', '.bowerrc'));
  return json.directory;
}

function flatten(one, two) {
  if (!one || one.length === 0) return two;
  if (!two || two.length === 0) return one;

  return one.concat(two);
}

function getDependencyIncludes(dependencies, callback) {
  var vendorDir = getVendorDir();

  async.map(dependencies,
            function (dep, next) {
              var depDir = path.join(vendorDir, dep),
                  depBower = path.join(depDir, 'bower.json'),
                  depIncludes;

              try {
                  depIncludes = loadJson(depBower).main;
              }
              catch(e) {
                console.warn(chalk.yellow("%s dependency does not have a 'bower.json'"), dep);
                return next(null, []);
              }

              if (!depIncludes) depIncludes = [];
              if (!isArray(depIncludes)) depIncludes = [depIncludes];

              depIncludes = depIncludes.map(function (i) {
                return path.join(vendorDir, dep, i);
              });

              next(null, depIncludes);
            },
            function (err, results) {
              if (results) {
                results = results.concat([getCustomBowerIncludes()]);
                results = results.reduce(flatten);
              }
              callback(err, results);
            });
}

function splitToStylesAndScripts(includes) {
  var obj = {
    styles: [],
    scripts: []
  };

  includes.forEach(function (include) {
    if (include.match(/\.css$/)) {
      return obj.styles.push(include);
    }

    if (include.match(/\.js$/)) {
      return obj.scripts.push(include);
    }
  });

  return obj;
}

var template = fs.readFileSync('app/index.html.hbs', 'utf8'),
    render = handlebars.compile(template);

var env = process.argv[2] || 'dev',
    buildDir = path.join('_build', env),
    outFile = path.join(buildDir, 'index.html');


var context = {
  env: env
};


async.parallel({
  dependencies: function (done) {
    var dependencies = getProjectDependencies(env === 'dev');
    getDependencyIncludes(dependencies, function (err, results) {
      if (err) return done(err);
      done(null, splitToStylesAndScripts(results));
    });
  },
  styles: function (done) {
    glob(path.join(buildDir, 'assets', 'styles', '**', '*.css'), done);
  },
  scripts: function (done) {
    glob(path.join(buildDir, 'assets', 'scripts', '**', '*.js'), done);
  }
}, function (err, files) {
  if (err) throw err;

  var styles = files.dependencies.styles,
      scripts = files.dependencies.scripts;

  context.styles = styles.concat(files.styles);
  context.scripts = scripts.concat(files.scripts);

  sh.mkdir('-p', buildDir);

  var html = render(context);

  fs.writeFileSync(outFile, html);
});

