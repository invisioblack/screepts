const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.carry.energy < creep.carryCapacity) {

      if(!creep.memory.energyTarget || Game.getObjectById(creep.memory.energyTarget.id) == null){
        creep.memory.energyTarget = actions.findBiggestDroppedEnergy(creep);
      }

      if (creep.memory.energyTarget) {
        var target = Game.getObjectById(creep.memory.energyTarget.id);

        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: {
              stroke: '#ff5500'
            }
          });
        }
      } else {
          if (!actions.withdrawFromNearestContainer(creep)) {
            actions.recycleSelf(creep);
          }
      }

    } else {
      // Proceed to the nearest building that needs energy and dump it
      // Prioritize spawns, then containers

      if (!actions.dumpEnergyAt(creep, STRUCTURE_SPAWN)) {
        if (!actions.dumpEnergyAt(creep, STRUCTURE_EXTENSION)) {
         actions.dumpEnergyAt(creep, STRUCTURE_STORAGE);
        }
      }

    }
  },

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    return spawn.createCreep([CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], memory = {
      role: 'courier'
    });
  }
}
