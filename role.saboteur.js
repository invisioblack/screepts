const jobActions = require('jobs.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {

    if (creep.memory.job) {
      let job = creep.memory.job;
      if (creep.pos.roomName != creep.memory.job.room) {
        jobActions.moveToTargetRoom(creep, job);
      } else {
        let job = creep.memory.job;
        jobActions[job.action](creep, job);
      }

    } else {
      creep.say('no job');
    }

  },

  sizes: [
    [WORK, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  ],

  create: function(spawn, memory) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = Object.assign({}, {role: 'saboteur'}, memory));
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }
  }
}
