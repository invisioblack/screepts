const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if (creep.room.name != creep.memory.targetRoom) {
      const exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
      const exit = creep.pos.findClosestByRange(exitDir);
      creep.moveTo(exit);
    } else {
      if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }

      if (creep.signController(creep.room.controller, 'Reserved.') == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }


  },

  create: function(spawn) {
    return spawn.createCreep(bodies.reserver, memory = {role: 'reserver'})
  }
}
