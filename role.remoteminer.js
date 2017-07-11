const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

const home = 'E68N43';

module.exports = {
  run: function(creep) {

    if (creep.room.name != creep.memory.targetRoom) {

      if (creep.carry.energy < creep.carryCapacity) {

        const exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        const exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);

      } else {
        if (creep.room.name == home) {
          actions.dumpEnergyAt(creep, STRUCTURE_CONTAINER);
        } else {
          // Head home
          const exitDir = Game.map.findExit(creep.room, home);
          const exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        }

      }

    } else {

      if (creep.carry.energy < creep.carryCapacity) {

        if (!actions.collectNearestDroppedEnergy(creep)) {
          // Go to the nearest source and mine untill full
          var source = creep.pos.findClosestByPath(FIND_SOURCES);

          if (source) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
            }
          }

        }
      } else {

        // Head home
        const exitDir = Game.map.findExit(creep.room, home);
        const exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);

      }
    }

  },

  create: function(spawn) {
    spawn.createCreep(bodies.remoteminer, memory = {
      role: 'remoteminer'
    })
  }
}
