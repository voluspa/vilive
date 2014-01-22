export
default Ember.Route.extend({
    model: function() {
        return this.store.filter('room');
    },

    setupController: function(controller) {
        controller.send('reset');
    }
});
