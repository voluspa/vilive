var Room = require('app/models/room')['default'];

export
default Ember.Controller.extend({
    needs: 'world',
    world: Ember.computed.alias('controllers.world'),

    location: function() {
        var world = this.get('world'),
            loc = world.get('lastLocation');

        if (!loc) return null;

        return {
            x: loc.x,
            y: loc.y,
            z: loc.z
        };
    }.property('world.lastLocation'),

    needsLocation: function() {
        if (this.get('location')) return false;
        return true;
    }.property('location'),

    actions: {
        save: function() {
            var self = this,
                loc = this.get('location'),
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
