$(function() {
    "use strict";

    $('<div/>', {
        'id': 'ember-test-fixture'
    })
        .appendTo('body');
});

Ember.Test.adapter = Ember.Test.MochaAdapter.create();

window.App = require('app/application')['default'].create();
App.rootElement = '#ember-test-fixture';
App.setupForTesting();
App.injectTestHelpers();
