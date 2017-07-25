const actions = require('creeps.actions');
const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');

module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.memory.job) {
      let job = creep.memory.job;
      jobActions[job.action](creep, job);
      return;
    }

    if (creep.ticksToLive < 200) {
      actions.recycleSelf(creep);
      return;
    }

  },

  spawnCondition: function(spawn) {
    let storage = spawn.room.storage;
    let numUpgraders = 0;
    if (spawn.room.memory.myCreepsByRole.upgrader) {
      numUpgraders = spawn.room.memory.myCreepsByRole.upgrader;
    }

    let storageCondition = storage && storage.store[RESOURCE_ENERGY] > numUpgraders.length * 1000;
    let numberCondition = spawn.room.energyCapacityAvailable > 200*numUpgraders.length;

    if (storage) {
      return storageCondition;
    } else {
      return numberCondition;
    }
  },

  sizes: [
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, CARRY, CARRY]
  ],

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = {
        role: 'upgrader'
      });
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }

  }
}
