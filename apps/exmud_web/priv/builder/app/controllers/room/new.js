export
default Ember.Controller.extend({
    actions: {
        save: function() {
            var self = this,
                room = this.get('model');

            room.save();
            self.transitionToRoute('room', room);
        },

        cancel: function() {
            this.transitionToRoute('world');
        }
    }
});
