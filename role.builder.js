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
      if (!creep.spawning && creep.ticksToLive < 1200) {
        creep.memory.role = 'upgrader';
      }
    }
  },

  spawnCondition: function(spawn) {
    let storage = spawn.room.storage;
    let numBuilders = 0;
    if (spawn.room.memory.myCreepsByRole.builder) {
      numBuilders = spawn.room.memory.myCreepsByRole.builder.length;
    }

    let storageCondition = storage && storage.store[RESOURCE_ENERGY] > storage.storeCapacity*0.005;
    let csCondition = Math.ceil(spawn.room.memory.constructionSites.length/2) - (numBuilders.length || 0) > 0;
    let energyCondition = spawn.room.energyAvailable >= 0.5*spawn.room.energyCapacityAvailable;

    if (storage) {
      return storageCondition && csCondition && energyCondition;
    } else {
      return csCondition && energyCondition;
    }
  },

  sizes: [
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
