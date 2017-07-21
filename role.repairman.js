const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if (creep.carry.energy == 0) {
      actions.withdrawFromNearestContainer(creep);
    } else {
      actions.repairNearest(creep);
    }
  },

  create: function(spawn) {
    return spawn.createCreep(bodies.createBasic(), memory={role: 'repairman'});
  }
}
