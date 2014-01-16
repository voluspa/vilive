var Room = require('app/models/room')['default'];

export
default Ember.Controller.extend({
    actions: {
        save: function() {
            var self = this,
                data = {};

            Room.eachAttribute(function(name) {
                data[name] = self.get(name);
            });

            var newRoom = this.store.createRecord('room', data);

            newRoom.save()
                .then(function() {
                    Room.eachAttribute(function(name) {
                        self.set(name, '');
                    });
                    self.transitionToRoute('room', newRoom);
                });
        },

        cancel: function() {
            var self = this;

            Room.eachAttribute(function(name) {
                self.set(name, '');
            });
            this.transitionToRoute('world');
        }
    }
});
