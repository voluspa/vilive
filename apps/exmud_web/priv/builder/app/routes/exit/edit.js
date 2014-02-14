export default Ember.Route.extend({
    model: function (params) {
        return null;
    },

    serialize: function (model) {
        return {
            room_id: model.get('from.id'), 
            exit_direction: model.get('direction') 
        };
    }
});
