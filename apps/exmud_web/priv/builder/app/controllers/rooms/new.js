export
default Ember.ObjectController.extend({
    actions: {
        save: function() {
            var self = this,
                room = this.get('model');

            room.save()
                .then(function() {
                    self.transitionToRoute('room', room);
                });
        },

        cancel: function() {
            this.transitionToRoute('rooms');
        }
    }
});
