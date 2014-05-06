/*jshint node:true */
var webdriver = require('webdriverjs');

function World(callback) {
  this.root = 'http://localhost:' + (process.env.port || 3001);
  callback();
}

World.prototype = {
  get browser() {
    var self = this;

    if (!this._browser) {
      var browser = process.env.browser || 'firefox',
          host = (process.env.TRAVIS && '127.0.0.2') || '127.0.0.1';

      this._browser = webdriver.remote({ host: host, desiredCapabilities: {browserName: browser } });
      if (typeof this._browser.navigate === 'undefined') {
        this._browser.navigate = function navigate(path) {
          return this.url(self.root + path);
        };
      }
      else {
        throw new Error('Trying to define "navigate" on browser, but found one existed');
      }
    }

    return this._browser;
  }
};

module.exports.World = World;
