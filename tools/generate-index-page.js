var handlebars = require('handlebars'),
    glob = require('glob'),
    async = require('async'),
    sh = require('shelljs');

var path = require('path'),
    fs = require('fs');

var template = fs.readFileSync('app/index.html.hbs', 'utf8'),
    render = handlebars.compile(template);

var env = process.argv[2] || 'dev',
    buildDir = path.join('_build', env),
    outFile = path.join(buildDir, 'index.html');

var context = {
  env: env
};

async.parallel({
  styles: function (done) {
    glob(path.join(buildDir, 'assets', 'styles', '**', '*.css'), done);
  },
  scripts: function (done) {
    glob(path.join(buildDir, 'assets', 'scripts', '**', '*.js'), done);
  }
}, function (err, files) {
  if (err) throw err;

  Object.keys(files, function (key) {
    context[key] = files[key];
  });

  sh.mkdir('-p', buildDir);

  var html = render(context);

  fs.writeFileSync(outFile, html);
});

