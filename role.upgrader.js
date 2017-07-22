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

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    return spawn.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, CARRY, CARRY], memory = {
      role: 'upgrader'
    });
  }
}
