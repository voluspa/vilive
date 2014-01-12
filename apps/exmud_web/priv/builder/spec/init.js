$(function() {
    $('<div/>', {
        'id': 'ember-test-fixture'
    })
        .appendTo('body');
});

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
App.rootElement = '#ember-test-fixture';
App.setupForTesting();
App.injectTestHelpers();
