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
  Attempts to pick up a piece of dropped energy from the biggest pile in the room.
*/
function collectBiggestDroppedEnergy(creep) {
  var dropped = creep.room.find(FIND_DROPPED_RESOURCES, {
    filter: {
      resourceType: RESOURCE_ENERGY
    }
  });

  if (dropped.length) {
    dropped = _.sortBy(dropped, e => {
      return e.amount
    });
    if (creep.pickup(_.last(dropped)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(_.last(dropped), {
        visualizePathStyle: {
          stroke: '#ff5500'
        }
      });
    }
    return true;
  }

  return false;
}

/*
  Finds the biggest pile of dropped energy in the room
*/
function findBiggestDroppedEnergy(creep) {
  var dropped = creep.room.find(FIND_DROPPED_RESOURCES, {
    filter: {
      resourceType: RESOURCE_ENERGY
    }
  });

  if (dropped.length) {
    dropped = _.sortBy(dropped, e => {
      return e.amount
    });
    return _.last(dropped);
  } else {
    return null;
  }
}

/*
  Attempts to approach the nearest structure of given type and withdraw energy from it
  Returns true if there is a structure with non-zero energy reserves anywhere
  in the room, false otherwise
*/
function withdrawFromNearestEnergyStructure(creep, structureType) {
  var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: structure => {
      return structure.structureType == structureType && structure.store[RESOURCE_ENERGY] > 0
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

function withdrawFromNearestContainer(creep) {
  return withdrawFromNearestEnergyStructure(creep, STRUCTURE_CONTAINER);
}

function withdrawFromNearestStorage(creep) {
  return withdrawFromNearestEnergyStructure(creep, STRUCTURE_STORAGE);
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
  var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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
  } else if (target && creep.transfer(target, RESOURCE_ENERGY) == OK) {

    if (creep.memory.role == 'remoteminer' && Memory.stats.energyGatheredRemote) {
      Memory.stats.energyGatheredRemote += creep.carry.energy;
    } else if (creep.memory.role == 'remoteminer') {
      Memory.stats.energyGatheredRemote = creep.carry.energy;
    }

    if (Memory.stats.energyGathered) {
      Memory.stats.energyGathered += creep.carry.energy;
    } else {
      Memory.stats.energyGathered = creep.carry.energy;
    }
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

/*
  Walks to a flag
*/
function rallyAtFlag(creep, flag, dist = 3) {
  if (creep.pos.getRangeTo(flag) > dist) {
    creep.moveTo(flag);
  }
}

/*
  Recycles a creep
*/
function recycleSelf(creep) {
  var spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: structure => (structure.structureType == STRUCTURE_SPAWN && structure.my)
  });

  if (spawn) {
    if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn);
    }
  }
}

module.exports = {
  collectNearestDroppedEnergy,
  collectBiggestDroppedEnergy,
  findBiggestDroppedEnergy,
  withdrawFromNearestContainer,
  withdrawFromNearestStorage,
  buildNearestConstructionSite,
  dumpEnergyAt,
  repairNearest,
  rallyAtFlag,
  recycleSelf
};
