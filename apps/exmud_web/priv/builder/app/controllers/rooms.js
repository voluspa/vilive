export default Ember.Controller.extend({
    needs: ['world'],
    world: Ember.computed.alias('controllers.world')
});
