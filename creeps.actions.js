/*
  Attempts to pick up the nearest piece of dropped energy.
  Returns true if there is dropped energy somewhere in the room,
  false otherwise
*/
function collectNearestDroppedEnergy(creep) {
  var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
  if (dropped) {
    if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
      creep.moveTo(dropped, {
        visualizePathStyle: {
          stroke: '#ffff00'
        }
      });
    }
    return true;
  }

  return false;
}

/*
  Attempts to approach the nearest container and withdraw energy from it
  Returns true if there is a container with non-zero energy reserves anywhere
  in the room, false otherwise
*/
function withdrawFromNearestContainer(creep) {
  var containers = creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
    }
  });

  if (containers.length) {
    var closest = _.sortBy(containers, [target => {
        creep.pos.getRangeTo(target.pos);
      }
    ])[0];

    if (closest && creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(closest, {
        visualizePathStyle: {
          stroke: '#ffff00'
        }
      });
    }
    return true;
  }

  return false;
}

/*
  Attempts to build the nearest construction site
*/
function buildNearestConstructionSite(creep) {
  var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

  if (targets.length) {
    var closest = _.sortBy(targets, [target => {
        creep.pos.getRangeTo(target.pos);
      }
    ])[0];

    if (closest && creep.build(closest) === ERR_NOT_IN_RANGE) {
      creep.moveTo(closest, {
        visualizePathStyle: {
          stroke: '#00ff00'
        }
      });
    }

    return true;
  }

  return false;
}

/*
  Finds the nearest structure of given type that has room for more energy and
  dumps the energy there. Returns true if structures of this type were found,
  false otherwise.
*/
function dumpEnergyAt(creep, structureType) {
  var targets = creep.room.find(FIND_MY_STRUCTURES, {
    filter: structure => {
      return structure.structureType == structureType && ((structure.store && structure.store[RESOURCE_ENERGY] < structure.storeCapacity) || structure.energy < structure.energyCapacity)
    }
  });

  if (targets.length) {
    var closest = _.sortBy(targets, [target => {
        creep.pos.getRangeTo(target.pos);
      }
    ])[0];

    if (closest && creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(closest, {
        visualizePathStyle: {
          stroke: '#00ff00'
        }
      });
    }

    return true;
  }

  return false;
}

module.exports = {
  collectNearestDroppedEnergy,
  withdrawFromNearestContainer,
  buildNearestConstructionSite,
  dumpEnergyAt
};
