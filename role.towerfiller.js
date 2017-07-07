const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {

  },

  create: function(spawn) {
    spawn.createCreep(bodies.basic, memory = {
      role: 'towerfiller'
    });
  }
}
