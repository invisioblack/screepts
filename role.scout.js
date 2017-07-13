const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {

    if (creep.room.name != creep.memory.targetRoom) {
      const exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
      const exit = creep.pos.findClosestByRange(exitDir);
      creep.moveTo(exit);
    } else {
      var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
        filter: c => {
          return !_.includes(config.allies, c.owner);
        }
      });
      if (target && creep.attack(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }

      if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS, {
          filter: spawn => {
            return !_.includes(config.allies, spawn.owner);
          }
        });
        if (target && creep.attack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }

        if (!target) {
          target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
              return structure.structureType == STRUCTURE_TOWER
            }
          });

          if (target && creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }

      }

    }

  },

  create: function(spawn) {
    return spawn.createCreep(bodies.createStrongestMelee(spawn, [MOVE, MOVE, MOVE]), memory = {
      role: 'scout'
    });
  }
}
