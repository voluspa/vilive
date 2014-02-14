export default DS.Model.extend({
    from: DS.belongsTo('room'),
    to: DS.belongsTo('room'),
    direction: DS.attr('string')
});
