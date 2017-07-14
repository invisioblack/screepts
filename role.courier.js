const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {

    // While there's still room for energy
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
      }

    } else {
      // Proceed to the nearest building that needs energy and dump it
      // Prioritize spawns, then containers

      if (!actions.dumpEnergyAt(creep, STRUCTURE_SPAWN)) {
        if (!actions.dumpEnergyAt(creep, STRUCTURE_EXTENSION)) {
          if (!actions.dumpEnergyAt(creep, STRUCTURE_STORAGE)) {
            actions.dumpEnergyAt(creep, STRUCTURE_CONTAINER);
          }
        }
      }

    }
  },

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    return spawn.createCreep(bodies.createFastest(spawn, base=[CARRY, MOVE, MOVE, MOVE, MOVE]), memory = {
      role: 'courier'
    });
  }
}
