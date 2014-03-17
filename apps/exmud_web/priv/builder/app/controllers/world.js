export
default Ember.ArrayController.extend({
    displayHelp: function() {
        return this.get('length') === 0;
    }.property('length'),

    location: null,

    pickingLocation: false,

    focus: null,

    actions: {
        selected: function (obj) {
            var route = 'room.edit',
                model = obj.model,
                query = {};

            this.set('focus', model);

            if (obj.model === null && obj.type === 'exit') {
                route = 'room.new';
                query = {
                    x: obj.target.x,
                    y: obj.target.y,
                    z: obj.target.z,
                    exit: obj.reverse
                };

                return this.transitionToRoute(route, { queryParams: query });
            }

            return this.transitionToRoute(route, model);
        },

        reset: function() {
            this.set('pickingLocation', false);
            this.set('location', null);
        }
    }
});
