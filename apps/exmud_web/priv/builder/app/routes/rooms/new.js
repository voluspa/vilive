export
default Ember.Route.extend({
    setupController: function(controller) {
        controller.get('world').send('reset');
    }
});
