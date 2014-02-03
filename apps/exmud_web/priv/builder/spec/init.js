Ember.Test.adapter = Ember.Test.MochaAdapter.create();

var router = require('app/router')['default'].reopen({
    rootURL: '',
    location: 'none'
});

require('app/adapters/application')['default'] = DS.FixtureAdapter.extend({});

function setFixtures(model, fixtures) {
    require('app/models/' + model)['default'].FIXTURES = fixtures;
}

window.App = require('app/application')['default'].create();
App.setupForTesting();
App.injectTestHelpers();

window.expect = chai.expect;

