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
  var dropped = creep.room.memory.droppedEnergy;

  if (dropped.length) {
    sortedDropped = _.sortBy(dropped, e => {
      return e.amount
    });
    let biggestDropped = Game.getObjectById(_.last(sortedDropped).id);

    if (creep.pickup(biggestDropped) == ERR_NOT_IN_RANGE) {
      creep.moveTo(biggestDropped, {
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
  Finds the biggest pile of dropped energy in the room
*/
function findBiggestDroppedEnergy(creep) {
  var dropped = creep.room.memory.droppedEnergy;

  if (dropped.length) {
    sortedDropped = _.sortBy(sortedDropped, e => {
      return e.amount
    });
    return _.last(sortedDropped);
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
  Attempts to dismantle the nearest structures schedule for dismantling
*/
function dismantleNearestStructure(creep) {
  var closest = _.sortBy(creep.room.memory.plan.dismantle, dismantle => {
    creep.pos.getRangeTo(dismantle.x, dismantle.y)
  });
  if (closest.length > 0) {
    var target = creep.room.lookAt(closest[0].x, closest[0].y);
    target = _.find(target, {'type': 'structure'});

    if (target && (target.structure.structureType == STRUCTURE_TOWER || target.structure.structureType == STRUCTURE_SPAWN)) {
      target = null;
    }

    if (target && creep.dismantle(target.structure) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target.structure, {
        visualizePathStyle: {
          stroke: '#0000ff',
          opacity: 0.75
        }
      });
    } else if (!target) {
      _.remove(creep.room.memory.plan.dismantle, dismantle => dismantle.x == closest[0].x && dismantle.y == closest[0].y);
    }
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
    filter: object => object.structureType != STRUCTURE_ROAD && object.hits < object.hitsMax
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
  recycleSelf,
  dismantleNearestStructure
};
