var Room = require('app/models/room')['default'];

export
default Ember.Controller.extend({
    needs: 'world',
    world: Ember.computed.alias('controllers.world'),

    isNew: true,

    location: Ember.computed.alias('world.location'),

    isInvalid: function() {
        if (Ember.isEmpty(this.get('world.location'))) return true;
        if (Ember.isEmpty(this.get('title'))) return true;
        if (Ember.isEmpty(this.get('description'))) return true;
        return false;
    }.property('title', 'description', 'location'),

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
                    self.transitionToRoute('room.edit', newRoom);
                });
        },

        cancel: function() {
            this.transitionToRoute('world');
        },

        reset: function () {
            var self = this;

            this.get('world').send('reset');
            Room.eachAttribute(function(name) {
                self.set(name, '');
            });
        }
    }
});
