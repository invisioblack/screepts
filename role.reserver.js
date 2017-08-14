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

      if (creep.signController(creep.room.controller, 'Reserved in the name of the Realms of Plannix') == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }


  },
  
  sizes: [
    [CLAIM, MOVE],
    [CLAIM, CLAIM, MOVE, MOVE],
    [CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE]
  ],

  create: function(spawn, memory) {
     let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = Object.assign({}, {
        role: 'reserver'
      }, memory));
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }
  }
}
