export default Ember.Route.extend({
  model: function(params) {
    var room = this.store.find('room', params.room_id);
    return room;
  }
});
