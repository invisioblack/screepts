const actions = require('creeps.actions');
const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');

module.exports = {
  run : function(creep) {

    if (creep.carry.energy > 0) {

      if (creep.memory.job) {

        let job = creep.memory.job;
        jobActions[job.action](creep, job);

      } else {
        actions.buildNearestConstructionSite(creep);
      }

    } else {

      if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
        if (!actions.withdrawFromNearestStorage(creep)) {
          actions.recycleSelf(creep);
        }
      } else {
        actions.dismantleNearestStructure(creep);
      }
    }

  },

  sizes: [
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, CARRY, CARRY]
  ],


  /** @param {StructureSpawn} spawn **/
  create: function(spawn) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = {
        role: 'builder'
      });
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }
  }
}
