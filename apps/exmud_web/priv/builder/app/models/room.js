var Room = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    location: DS.attr(),
    exits: DS.hasMany('exit', { inverse: 'from' })
});

// so exits are kept track of by their cardinal direction
// the exit themselves could be aliased or something
Room.EXITS = [
    'north',
    'east',
    'south',
    'west'
];

export default Room;
