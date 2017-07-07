const actions = require('creeps.actions');
const bodies = require('creeps.bodies');


module.exports = {
  run: function(creep) {
    if(creep.room.controller.my) {
      var target = creep.pos.findClosestByPath(FIND_EXIT);
      if(target) {
        creep.moveTo(target);
      }
    } else {
      var target = creep.room.controller;
      if(creep.attackController(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  },

  create: function(spawn) {
    spawn.createCreep(bodies.reclaimer, memory={role: 'reclaimer'});
  }
}
