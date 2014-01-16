export
default Ember.Route.extend({
    model: function() {
        return this.store.createRecord('room');
    },

    deactivate: function() {
        var model = this.controllerFor('room.new')
            .get('model');

        if (!model.get('isSaving')) {
            model.rollback();
        }
    },

    renderTemplate: function() {
        this.render('room');
    }
});
