var Router = Ember.Router.extend({
    rootURL: '/builder/',
    location: 'history'
});

Router.map(function() {
    this.resource('room', {
        path: '/room/:room_id'
    });
    this.resource('rooms', function() {
        this.route('new');
    });
});

export
default Router;
