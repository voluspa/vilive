var Router = Ember.Router.extend({
  location: 'history'
});

Router.map(function() {
  /*
   * At somepoint in the future perhaps we can have a world chooser
   * that lets you select which world to build.
   *
   * this.route('worldChooser', { path: '/world' }); */

  this.resource('world', { path: '/world/:name' }, function() {
    this.resource('room', { path: '/room/:id' }, function() {
      this.route('new');
      this.route('edit');
      this.resource('exit', { path: '/exit/:direction' }, function() {
        this.route('new');
      });
    });
  });
});

export
default Router;
