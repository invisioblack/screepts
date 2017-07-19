const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      if (!actions.withdrawFromNearestContainer(creep)) {
        actions.withdrawFromNearestStorage(creep);
      }
    } else {
      var towers = _.filter(creep.room.memory.structures, {structureType: STRUCTURE_TOWER});
      if (towers.length > 0 && towers[0].energy < towers[0].energyCapacity) {
        actions.dumpEnergyAt(creep, STRUCTURE_TOWER);
      } else {
        actions.recycleSelf(creep);
      }

    }
  },

  create: function(spawn) {
    return spawn.createCreep(bodies.createBasic(), memory = {
      role: 'towerfiller'
    });
  }
}
