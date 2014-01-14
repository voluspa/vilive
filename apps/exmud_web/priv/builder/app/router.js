var Router = Ember.Router.extend({
    rootURL: '/builder/',
    location: 'history'
});

Router.map(function() {
    this.resource('room', function() {
        this.route('new');
    });
});

export
default Router;
