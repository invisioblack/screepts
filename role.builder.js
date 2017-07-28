const actions = require('creeps.actions');
const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');

module.exports = {
  run : function(creep) {
      if (creep.memory.job) {
        let job = creep.memory.job;
        jobActions[job.action](creep, job);
      } else {
        creep.say('no job');
      }
  },

  spawnCondition: function(spawn) {
    let storage = spawn.room.storage;
    let numBuilders = 0;
    if (spawn.room.memory.myCreepsByRole.builder) {
      numBuilders = spawn.room.memory.myCreepsByRole.builder.length;
    }

    let storageCondition = storage && storage.store[RESOURCE_ENERGY] > storage.storeCapacity*0.05;
    let csCondition = Math.floor(spawn.room.memory.constructionSites.length/5) - (numBuilders.length || 0) > 2;
    let energyCondition = spawn.room.energyAvailable >= 0.33*spawn.room.energyCapacityAvailable;

    if (storage) {
      return storageCondition && csCondition && energyCondition;
    } else {
      return csCondition && energyCondition;
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
