export
default Ember.ArrayController.extend({
    displayHelp: function() {
        return this.get('length') === 0;
    }.property('length'),

    lastLocation: null,
    state: 'selecting',

    actions: {
        setLocation: function(loc) {
            this.set('lastLocation', loc);
        },

        changeState: function(state) {
            switch (state) {
                case 'pickingLocation':
                    this.send('reset');
                    this.set('state', state);
                    break;
            }
        },

        reset: function() {
            this.set('state', 'selecting');
            this.set('lastLocation', null);
        }
    }
});
