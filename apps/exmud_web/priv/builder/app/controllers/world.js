export
default Ember.ArrayController.extend({
    displayHelp: function() {
        return this.get('length') === 0;
    }.property('length'),

    location: null,

    actions: {
        reset: function() {
            this.set('location', null);
        }
    }
});
