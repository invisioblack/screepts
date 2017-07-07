const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

const home = 'E68N43';

module.exports = {
  run: function(creep) {
    if (creep.room.controller.my) {

      if (creep.carry.energy < creep.carryCapacity) {
        var target = creep.pos.findClosestByPath(FIND_EXIT);
        if (target) {
          creep.moveTo(target);
        }
      } else {
        actions.dumpEnergyAt(creep, STRUCTURE_CONTAINER);
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
        const route = Game.map.findRoute(creep.room, home);

        if (route.length > 0) {
          const exit = creep.pos.findClosestByRange(route[0].exit);
          creep.moveTo(exit);
        }


      }
    }

  },

  create: function(spawn) {
    spawn.createCreep(bodies.basic, memory = {
      role: 'remoteminer'
    })
  }
}
