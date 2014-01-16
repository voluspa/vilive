export
default Ember.Route.extend({
    model: function() {
        var self = this;

        Ember.$.getJSON('/api/rooms')
            .then(function(data) {
                self.store.pushMany('room', data.rooms || []);
            });
    }
});
