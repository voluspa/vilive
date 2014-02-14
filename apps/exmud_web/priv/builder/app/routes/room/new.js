export
default Ember.Route.extend({
    setupController: function(controller) {
        controller.send('reset');
        controller.get('world').set('pickingLocation', true);
        this.set('controller', controller);
    },

    deactivate: function() {
        this.get('controller').send('reset');
    }
});
