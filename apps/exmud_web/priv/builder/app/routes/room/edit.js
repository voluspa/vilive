export
default Ember.Route.extend({
    setupController: function (controller, model) {
        controller.set('content', model);
        controller.get('world').set('focus', model);
        this.set('controller', controller);
    },

    deactivate: function (controller) {
        this.get('controller.world').set('focus', null);
    }
});
