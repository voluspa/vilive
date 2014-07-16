import DS from 'ember-data';

// copied from first.stab
var Exit = DS.Model.extend({
  from: DS.belongsTo('room'),
  to: DS.belongsTo('room'),
  direction: DS.attr('string')
});

export default Exit;
