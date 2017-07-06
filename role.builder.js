var roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.memory.building === undefined) {
      creep.memory.building = true;
    }

    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('harvest');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('build');
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
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

module.exports = roleBuilder;
