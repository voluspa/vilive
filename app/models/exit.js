// copied from first.stab

var Exit = DS.Model.extend({
  from: DS.belongsTo('room'),
  to: DS.belongsTo('room'),
  direction: DS.attr('string')
});

Exit.reopenClass({
  FIXTURES: [
    { id: 1, from: 1, direction: 'south' },
    { id: 2, from: 1, direction: 'north' },
    { id: 3, from: 2, direction: 'west' },
    { id: 4, from: 2, direction: 'east' },
  ]
});

export default Exit;
