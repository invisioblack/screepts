const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {


    if (creep.room.controller.my) {
      creep.moveTo(49, 20);
    } else {
      var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
      if (creep.attack(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }

      if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }

        if (!target) {
          target = creep.room.controller;
          if (creep.attackController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }

          if (!target) {
            creep.moveTo(0, 21);
          }
        }
      }

    }

  },

  create: function(spawn) {
    spawn.createCreep(bodies.scout, memory = {
      role: 'scout'
    });
  }
}
