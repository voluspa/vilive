//quick hack so that the test page isn't doing a bunch of flow/draw for the
//views popping in and out of view
var customTestStyle = document.createElement('style');
customTestStyle.innerText = ".ember-view { display: none; }";
document.getElementsByTagName('head')[0].appendChild(customTestStyle);

Ember.Test.adapter = Ember.Test.MochaAdapter.create();

var router = require('app/router')['default'].reopen({
    rootURL: '',
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
