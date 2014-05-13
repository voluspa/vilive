var World = DS.Model.extend({
  name: DS.attr('string'),
  rooms: DS.hasMany('room')
}); 

World.reopenClass({
  FIXTURES: [
    { id: 1, name: 'Menn', rooms: [1, 2] }
  ]
});

export default World;
