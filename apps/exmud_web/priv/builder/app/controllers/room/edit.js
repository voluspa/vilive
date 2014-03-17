export
default Ember.ObjectController.extend({
    needs: 'world',
    world: Ember.computed.alias('controllers.world'),

    actions: {
        save: function () {
            throw Error("not implemented yet");
        },

        cancel: function () {
            throw Error("not implemented yet");
        }
    }
});
