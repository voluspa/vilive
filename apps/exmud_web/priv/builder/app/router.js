"use strict";

var Router = Ember.Router.extend({
    rootURL: '/builder/',
    location: 'history'
});

Router.map(function() {
    this.resource("rooms", function() {});
});

export
default Router;
