export
default Ember.ArrayController.extend({
    displayHelp: function() {
        return this.get('length') === 0;
    }.property('length'),

    location: null,

    pickingLocation: false,

    actions: {
        selected: function (obj) {
            var route = 'room.edit',
                model = obj.model;

            if (obj.model === null && obj.type === 'exit') {
                route = 'exit.edit';
                model = this.store.createRecord('exit', {
                    direction: obj.direction,
                    from: obj.room
                });
            }

            this.transitionToRoute(route, model);
        },

        reset: function() {
            this.set('pickingLocation', false);
            this.set('location', null);
        }
    }
});
