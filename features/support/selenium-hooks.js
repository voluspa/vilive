/*jshint node:true */
module.exports = function () {
  this.Before(function (callback) {
    this.browser
        .init()
        .url('http://localhost:' + (process.env.port || 3001))
        .call(callback);
  });

  this.After(function (callback) {
    this.browser
        .end(callback);
  });
};
