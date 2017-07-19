const actions = require('creeps.actions');
const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.carry.energy < creep.carryCapacity) {

      if (creep.memory.job) {
        let job = creep.memory.job;
        jobActions[job.action](creep, job);
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
    return spawn.createCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], memory = {
      role: 'courier'
    });
  }
}
