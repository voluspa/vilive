export
default DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    x: DS.attr('number'),
    y: DS.attr('number'),
    z: DS.attr('number')
});
