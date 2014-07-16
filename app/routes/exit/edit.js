import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var world = this.modelFor('world'),
        room = world.rooms.objectAt(params.room_id);

    if (!room) throw new Error('Room is not part of this world');

    return room;
  }
});
