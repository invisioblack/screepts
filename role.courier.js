const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {

    // While there's still room for energy
    if (creep.carry.energy < creep.carryCapacity) {

      // Find the nearest piece of dropped energy and pick it up
      actions.collectNearestDroppedEnergy(creep);
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
