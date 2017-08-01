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
    let totalDropped = _(spawn.room.memory.droppedMinerals).map(d => d.amount).sum();
    let numMCouriers = 0;
    if (spawn.room.memory.myCreepsByRole.mineralCourier) {
      numMCouriers = spawn.room.memory.myCreepsByRole.mineralCourier.length;
    }

    return Math.ceil(totalDropped/100) - numMCouriers > 0;
  },

  sizes: [
    [CARRY, CARRY, MOVE, MOVE],
    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
  ],

  create: function(spawn) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = {
        role: 'mineralCourier'
      });
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }
  }
}
