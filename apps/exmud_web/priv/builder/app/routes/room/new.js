export
default Ember.Route.extend({
    setupController: function(controller, query) {
        controller.send('reset');
        this.set('controller', controller);

        if (!query.loc || query.loc === 'undefined') return;
        var loc = JSON.parse(query.loc);
        controller.set('world.location', loc);
    },

    deactivate: function() {
        this.get('controller').send('reset');
        this.set('controller.world.pickingLocation', false);
    }
});
