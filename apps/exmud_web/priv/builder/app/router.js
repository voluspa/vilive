var Router = Ember.Router.extend({
    rootURL: '/builder/',
    location: 'history'
});

Router.map(function() {
    this.route('world');

    this.resource('exit', { path: '/room/:room_id/exit' }, function () {
        this.route('edit', { path: '/:exit_direction' });
    });

    this.resource('room', function () {
        this.route('new');
        this.route('edit', { path: '/:room_id' });
    });
});

export
default Router;
