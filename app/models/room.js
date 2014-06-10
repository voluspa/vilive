// copied from first.stab
var Room = DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  location: DS.attr(), // need to see about defining a full on point object with validations
  exits: DS.hasMany('exit', { inverse: 'from' })
});

export default Room;
