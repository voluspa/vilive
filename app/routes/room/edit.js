import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var world = this.modelFor('world'),
        rooms = world.get('rooms');

    if (!rooms) throw new Error('Room is not part of this world');

    return rooms[params.room_id];
  }
});
