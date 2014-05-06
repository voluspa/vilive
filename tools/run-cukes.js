#!/usr/bin/env node
var spawn = require('child_process').spawn,
    chalk = require('chalk');

//by default we use 3000 for the api-stub server but we don't
//want our manual test state to interfere with the cucumber runs
//so overriding the port here
process.env.port = 3001;
if (process.argv[2]) process.env.browser = process.argv[2];


function pipeIO(child, prefix) {
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function (data) {
    if (data[data.length - 1] === '\n') {
      data = data.substr(0, data.length - 1);
    }

    console.log('[' + prefix + '] ' + data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    if (data[data.length - 1] === '\n') {
      data = data.substr(0, data.length - 1);
    }

    console.error(chalk.red('[' + prefix + '] ' + data));
  });

  child.on('close', function (code) {
    var msg = '[' + prefix + '] exited with ' + code;
    if (code === 0) return console.log(chalk.green(msg));
    console.log(chalk.yellow(msg));
  });
}

var apiStub = spawn('make', ['server']);
pipeIO(apiStub, 'api-stub');

//travis config starts this for us
if (!process.env.TRAVIS) {
  var selenium = spawn('make', ['selenium']);
  pipeIO(selenium, 'selenium');
}

setTimeout(function () {
  var cuke = spawn('make', ['features']);
  pipeIO(cuke, 'cucumber');

  cuke.on('close', function (code) {
    apiStub.kill();
    if (!process.env.TRAVIS) selenium.kill();
    process.exit(code);
  });
}, 1500);

