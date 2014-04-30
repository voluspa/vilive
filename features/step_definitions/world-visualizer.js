module.exports = function () {
  this.Given(/^I am on the builder page$/, function (callback) {
    this.browser
        .navigate('/')
        .call(callback);
  });

  this.When(/^I scroll up inside the world visualizer$/, function (callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Then(/^I see the world zoom in$/, function (callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.When(/^I scroll down inside the world visualizer$/, function (callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Then(/^I see the world zoom out$/, function (callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });
};
