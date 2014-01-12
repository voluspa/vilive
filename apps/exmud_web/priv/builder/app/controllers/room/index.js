export
default Ember.ArrayController.extend({
    displayHelp: function() {
        return this.get('length');
    }.property('length')
});
