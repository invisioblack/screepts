var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('harvest');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: {
            stroke: '#ffffff'
          }
        });
      }
    } else {
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
      } else {
        // Find a container and get energy from it
        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: structure => {
            return structure.structureType == STRUCTURE_CONTAINER &&
              structure.store[RESOURCE_ENERGY] > 0
          }
        });

        var closest = _.sortBy(containers, [targe => {
          creep.pos.getRangeTo(target.pos);
        }])[0];

        if (creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closest, {
            visualizePathStyle: {
              stroke: '#ffff00'
            }
          });
        }
      }
    }
  }
};

module.exports = roleUpgrader;
