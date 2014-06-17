/*jshint globalstrict: true, node: true */
"use strict";
var express = require('express'),
    fs = require('fs'),
    path = require('path');

process.on('uncaughtException', console.error);

var livereload = require('better-livereload');
var server = livereload.createServer();
server.watch(path.join(__dirname, '..', '_build', 'dev'));

//have to load this before creating the app
require('express-namespace');

var port = process.env.port || 3000;
var app = express();
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());

// api stubs
app.namespace('/api', function () {
  registerResource(app, 'world', [
    {
      "name": "test",
      "rooms": ["1", "2"],
      "id": 1
    }
  ]);
  registerResource(app, 'room', [
    {
      "title": "troom",
      "description": "yet another",
      "id": 1
    },
    {
      "title": "broom",
      "description": "yeah",
      "id": 2
    }
  ]);
  registerResource(app, 'exit', []);
});

app.use(static_file({ urlRoot: '/vendor', directory: 'vendor' }));
app.use(static_file({ urlRoot: '/_build', directory: '_build' }));
app.use(static_file({ urlRoot: '/', directory: '_build/dev' }));
app.use(static_file({ urlRoot: '/', file: '_build/dev/index.html' }));

app.listen(port);
console.log('started on ' + port);

// taken from ember-app-kit

// https://github.com/stefanpenner/ember-app-kit/blob/53e434f0d6619f544bc92de4e85de398d4fc3c36/tasks/express-server.js#L86
function static_file(options) {
  return function(req, res, next) { // Gotta catch 'em all (and serve index.html)
    var filePath = "";
    if (options.directory) {
      var regex = new RegExp('^' + (options.urlRoot || ''));
      // URL must begin with urlRoot's value
      if (!req.path.match(regex)) { next(); return; }
      filePath = options.directory + req.path.replace(regex, '');
    } else if (options.file) {
      filePath = options.file;
    } else { throw new Error('static() isn\'t properly configured!'); }

    fs.stat(filePath, function(err, stats) {
      if (err) { next(); return; } // Not a file, not a folder => can't handle it

      // Is it a directory? If so, search for an index.html in it.
      if (stats.isDirectory()) { filePath = path.join(filePath, 'index.html'); }

      // Serve the file
      console.log(options, ' -> ', filePath);
      res.sendfile(filePath, function(err) {
        if (err) {
          console.error(err);
          next();
          return;
        }
      });
    });
  };
}

function registerResource(app, resource, data) {
    var nextId = 1,
        plural = resource + 's';

    app.get('/' + plural, function (req, res) {
        var r = {};
        r[plural] = data;

        console.log('Sending (get all): ' + JSON.stringify(r));
        res.send(r);
    });

    app.get('/' + plural + '/:id', function (req, res) {
        var r = {};

        r[resource] = data.filter(function (p) {
            return p.id === parseInt(req.params.id);
        })[0];

        console.log('Sending (get with id): ' + JSON.stringify(r));

        res.send(r);
    });

    app.post('/' + plural, function (req, res) {
        var e = req.body[resource],
            r = {};

        console.log('Posted: ' + JSON.stringify(e));
        e.id = (nextId++).toString();
        data.push(e);

        r[resource] = e;
        res.send(r);
    });
}
