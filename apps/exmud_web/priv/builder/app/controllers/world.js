export
default Ember.ArrayController.extend({
    displayHelp: function() {
        return this.get('length') === 0;
    }.property('length'),

    location: null,

    pickingLocation: false,

    actions: {
        selected: function (obj) {
            var model = obj.model;

            if (obj.model === null && obj.type === 'exit') {
                model = this.store.createRecord('exit', {
                    direction: obj.direction,
                    from: obj.room
                });
            }

            this.transitionToRoute(obj.type + '.edit', model);
        },

        reset: function() {
            this.set('pickingLocation', false);
            this.set('location', null);
        }
    }
});
