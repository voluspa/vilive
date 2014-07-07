var Router = Ember.Router.extend({
  location: 'history'
});

Router.map(function() {
  /*
   * At somepoint in the future perhaps we can have a world chooser
   * that lets you select which world to build.
   *
   * this.route('worldChooser', { path: '/world' }); */

  this.route('login');

  this.route('worlds');
  this.resource('world', { path: 'world/:world_name' }, function() {
    /*
    this.resource('room', function() {
      this.route('new', { path: 'new' });
      this.route('edit', { path: '/:room_id' });
      this.resource('exit', { path: '/:room_id/exit/' }, function() {
        this.route('new', { path: '/:exit_id/new' });
        this.route('edit', { path: '/:exit_id' });
      });
    });
   */
  });
});

export
default Router;
