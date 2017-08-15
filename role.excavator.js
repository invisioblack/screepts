const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');

module.exports = {
  run: function(creep) {
    if (creep.memory.job) {
      let job = creep.memory.job;
      jobActions[job.action](creep, job);
    } else {
      creep.say('no job');
    }
  },

  spawnCondition: function(spawn) {
    let extractor = global.Cache.rooms[spawn.room.name].structuresByType.extractor;
    let mineral = Game.getObjectById(spawn.room.memory.minerals[0].id);
    let numExcavators = 0;
    if (spawn.room.memory.myCreepsByRole.excavator) {
      numExcavators = spawn.room.memory.myCreepsByRole.excavator.length;
    }

    return extractor && (numExcavators < 1) && mineral.mineralAmount > 0;

  },

  sizes: [
    [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  ],

  create: function(spawn) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = {role: 'excavator'});
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }
  }
}
