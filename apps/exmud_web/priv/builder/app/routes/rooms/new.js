export
default Ember.Route.extend({
    setupController: function(controller) {
        controller.send('reset');
        this.set('controller', controller);
    },

    deactivate: function() {
        this.get('controller').send('reset');
    }
});
