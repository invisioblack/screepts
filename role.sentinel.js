const actions = require('creeps.actions');
const bodies = require('creeps.bodies');


/*
  Sentinels guard their rooms
*/
module.exports = {
  run: function(creep) {

  },

  create: function(spawn) {
    spawn.createCreep(bodies.sentinel, memory = {
      role: 'sentinel'
    });
  }
}
