Ember.Test.adapter = Ember.Test.MochaAdapter.create();

var router = require('app/router')['default'].reopen({
    location: 'none'
});

require('app/adapters/application')['default'] = DS.FixtureAdapter.extend({});

window.App = require('app/app')['default'].create();
window.App.setupForTesting();
window.App.injectTestHelpers();

window.expect = chai.expect;

function setFixtures(model, fixtures) {
    require('app/models/' + model)['default'].FIXTURES = fixtures;
}

function getStore() {
    return window.App.__container__.lookup('store:main');
}
