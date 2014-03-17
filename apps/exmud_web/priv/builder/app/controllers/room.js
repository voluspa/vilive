export
default Ember.ObjectController.extend({
    needs: ['world'],
    world: Ember.computed.alias('controllers.world')
});
