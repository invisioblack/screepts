const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      actions.withdrawFromNearestContainer(creep);
    } else {
      actions.repairNearest(creep);
    }
  },

  create: function(spawn) {
    spawn.createCreep(bodies.basic, memory={role: 'repairman'});
  }
}
