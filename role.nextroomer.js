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

  create: function(spawn, memory) {
    return spawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], memory = Object.assign({}, {role: 'nextroomer'}, memory));
  }
}
