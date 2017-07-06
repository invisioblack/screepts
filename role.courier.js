const bodies = require('creeps.bodies');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {

    // While there's still room for energy
    if (creep.carry.energy < creep.carryCapacity) {

      // Find the nearest piece of dropped energy and pick it up
      var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
      if (dropped) {
        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped, {
            visualizePathStyle: {
              stroke: '#ffff00'
            }
          });
        }
      }
    } else {
      // Proceed to the nearest building that needs energy and dump it
      // Prioritize containers
      var containers = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_CONTAINER &&
          structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        }
      });

      var possibleTargets = containers;

      if (possibleTargets.length < 1) {
        possibleTargets = creep.room.find(FIND_MY_STRUCTURES, {
          filter: structure => {
            return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity);
          }
        });
      }

      var closest = _.sortBy(possibleTargets, [target => {
        creep.pos.getRangeTo(target.pos);
      }])[0];

      if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closest, {
          visualizePathStyle: {
            stroke: '#00ff00'
          }
        });
      }

    }

  },

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    spawn.createCreep(bodies.fast, memory = {
      role: 'courier'
    });
  }
}
