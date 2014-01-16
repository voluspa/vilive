var Router = Ember.Router.extend({
    rootURL: '/builder/',
    location: 'history'
});

Router.map(function() {
    this.route('world');

    this.route('room.new', {
        path: '/room/new'
    });

    this.resource('room', {
        path: '/room/:room_id'
    });
});

export
default Router;
