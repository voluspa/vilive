export
default Ember.Route.extend({
    model: function() {
        return this.store.createRecord('room');
    },
    renderTemplate: function() {
        this.render('room');
    }
});
