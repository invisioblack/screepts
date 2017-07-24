const actions = require('creeps.actions');
const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');


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
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
  ],

  create: function(spawn, memory) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = Object.assign({}, {role: 'nextroomer'}, memory));
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }

  }
}
