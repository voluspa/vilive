export
default Ember.Route.extend({
    model: function() {
        return this.store.filter('room');
    },

    setupController: function(controller, model) {
        controller.set('model', model);
        controller.send('reset');
    }
});
