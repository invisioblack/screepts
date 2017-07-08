const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {

    // While there's still room for energy
    if (creep.carry.energy < creep.carryCapacity) {

      if (creep.room.executeEveryTicks(50) || !creep.memory.energyTarget) {
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
      }

    } else {
      // Proceed to the nearest building that needs energy and dump it
      // Prioritize spawns, then containers

      if (!actions.dumpEnergyAt(creep, STRUCTURE_SPAWN)) {
        if (!actions.dumpEnergyAt(creep, STRUCTURE_CONTAINER)) {
          actions.dumpEnergyAt(creep, STRUCTURE_EXTENSION);
        }
      }

    }
  },

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    spawn.createCreep(bodies.fast, memory = {
      role: 'courier'
    });
  }
}
