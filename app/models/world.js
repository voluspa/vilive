import DS from 'ember-data';

var World = DS.Model.extend({
  name: DS.attr('string'),
  rooms: DS.hasMany('room', { async: true })
}); 

export default World;
