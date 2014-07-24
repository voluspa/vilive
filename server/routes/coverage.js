var express = require('express');
var fs = require('fs');

if (!fs.existsSync('coverage')) {
  fs.mkdirSync('coverage');
}

module.exports = function(app) {
  var coverageRouter = express.Router();
  coverageRouter.post('/', function(req, res) {
    req.pipe(fs.createWriteStream('coverage/coverage.json'));
    res.end();
  });
  app.use('/api/__coverage', coverageRouter);
};
