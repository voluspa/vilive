/*jshint globalstrict: true, node: true */
"use strict";
var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    lockFile = require('lockfile');

//have to load this before creating the app
require('express-namespace');

var port = process.env.port || 3000;

var app = express();
app.use(lock);
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());

app.use(require("connect-livereload")());

// api stubs
app.namespace('/api', function () {
    var nextId = 1;
    var rooms = [];

    app.get('/rooms', function (req, res) {
        var filtered = rooms,
            queryKeys = Object.keys(req.query);

        if (queryKeys.length > 0) {
            filtered = rooms.filter(function (room) {
                for(var i = 0; i < queryKeys.length; i++) {
                    var key = queryKeys[i],
                        value = req.query[key];

                    if (room[key] != value) {
                        return false;
                    }
                }

                return true;
            });
        }

        res.send({
            rooms: filtered
        });
    });

    app.get('/rooms/:id', function (req, res) {
        var room = rooms.filter(function (r) {
            return r.id == req.params.id;
        })[0];

        res.send({
            room: room
        });
    });

    app.post('/rooms', function (req, res) {
        var room = req.body.room;
        room.id = nextId++;

        rooms.push(room);
        res.send({
            room: room
        });
    });
});

app.use(static_file({ urlRoot: '/vendor', directory: 'vendor' }));
app.use(static_file({ urlRoot: '/assets', directory: '_build/assets' }));
app.use(static_file({ urlRoot: '/builder', file: '_build/index.html' }));

app.listen(port);
console.log('started on ' + port);

// taken from ember-app-kit

// https://github.com/stefanpenner/ember-app-kit/blob/53e434f0d6619f544bc92de4e85de398d4fc3c36/tasks/express-server.js#L78
function lock(req, res, next) { 
(function retry() {
  if (lockFile.checkSync('.connect.lock')) {
    setTimeout(retry, 30);
  } else { next(); }
})();
}

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
            res.sendfile(filePath, function(err) {
                if (err) { next(); return; }
            });
        });
    };
}
