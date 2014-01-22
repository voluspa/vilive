export
default Ember.ObjectController.extend({
    needs: 'world',
    world: Ember.computed.alias('controllers.world'),

    actions: {
        save: function() {

        },

        cancel: function() {

        }
    }
});
