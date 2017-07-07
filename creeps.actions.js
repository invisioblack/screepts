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
  var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: structure => {
      return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
    }
  });


  if (target && creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: {
        stroke: '#ffff00'
      }
    });
  }

  if (target) {
    return true;
  } else {
    return false;
  }

}

/*
  Attempts to build the nearest construction site
*/
function buildNearestConstructionSite(creep) {
  var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

  if (target && creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: {
        stroke: '#00ff00'
      }
    });
  }

  if (target) {
    return true;
  } else {
    return false;
  }

}

/*
  Finds the nearest structure of given type that has room for more energy and
  dumps the energy there. Returns true if structures of this type were found,
  false otherwise.
*/
function dumpEnergyAt(creep, structureType) {
  var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: structure => {
      return structure.structureType == structureType && ((structure.store && structure.store[RESOURCE_ENERGY] < structure.storeCapacity) || structure.energy < structure.energyCapacity)
    }
  });

  if (target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: {
        stroke: '#00ff00'
      }
    });
  }

  if (target) {
    return true;
  } else {
    return false;
  }
}

/*
  Finds the nearest structure that requires repairs, and attempts to repair it.
*/
function repairNearest(creep) {
  var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: object => object.hits < object.hitsMax
  });

  if (target && creep.repair(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
  }

  if (target) {
    return true;
  } else {
    return false;
  }

}

module.exports = {
  collectNearestDroppedEnergy,
  withdrawFromNearestContainer,
  buildNearestConstructionSite,
  dumpEnergyAt,
  repairNearest
};
