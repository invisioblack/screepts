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
        creep.say('no job');
      }

    }

  },

  spawnCondition: function(spawn) {
    let storage = spawn.room.storage;
    let numBuilders = 0;
    if (spawn.room.memory.myCreepsByRole.builder) {
      numBuilders = spawn.room.memory.myCreepsByRole.builder.length;
    }

    let storageCondition = storage && storage.store[RESOURCE_ENERGY] > numBuilders.length * 1000;
    let csCondition = Math.floor(spawn.room.memory.constructionSites.length/5) - numBuilders.length > 0;

    if (storage) {
      return storageCondition && csCondition;
    } else {
      return csCondition;
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
