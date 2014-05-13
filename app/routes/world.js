export default Ember.Route.extend({
  model: function(params) {
    var worlds = this.store.all('world'),
        world;

        world = worlds.forEach(function(w) {
          if (w.get('name').toLowerCase() === params.world_name.toLowerCase())
            world = w; 
        });

    return world;
  }
});
