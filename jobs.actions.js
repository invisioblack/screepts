function buildAction(creep, job) {
  if (creep.carry.energy == 0) {
    delete creep.memory.job;
  }

  let constructionSite = Game.getObjectById(job.target);
  if (constructionSite) {
    let result = creep.build(constructionSite);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(constructionSite, {visualizePathStyle: {opacity: 1, stroke: '#ffff00'}});
    } else if (result == OK) {
      if (creep.carry.energy == 0) {
        delete creep.memory.job;
      }
    }
  } else {
    delete creep.memory.job;
  }
}

function upgradeAction(creep, job) {
  let result = creep.upgradeController(creep.room.controller);
  if (result == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller);
  } else if (result == OK || creep.carry.energy == 0) {
    delete creep.memory.job;
  }
}

function dumpEnergyAction(creep, job) {
  let target = Game.getObjectById(job.target);
  if (target) {
    let result = creep.transfer(target, RESOURCE_ENERGY);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    } else if(result == ERR_FULL || creep.carry.energy == 0) {
      delete creep.memory.job;
    } else if (result == OK) {
      delete creep.memory.job;
    }
  } else {
    delete creep.memory.job;
  }
}

function dumpMineralAction(creep, job) {
  if (_.sum(creep.carry) === 0) {
    delete creep.memory.job;
  }

  let target = Game.getObjectById(job.target);
  if (target) {
    for (let mineral in creep.carry) {
      if (creep.carry[mineral] === 0) {
        continue;
      }
      let result = creep.transfer(target, mineral);
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      } else if (result == ERR_FULL || _.sum(creep.carry) === 0) {
        delete creep.memory.job;
      }
    }

  } else {
    delete creep.memory.job;
  }
}

function recycleSelfAction(creep, job) {
  let target = Game.getObjectById(job.target);
  if (target) {
    let result = target.recycleCreep(creep);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
}

function collectResourceAction(creep, job) {
  if (_.sum(creep.carry) === creep.carryCapacity) {
       delete creep.memory.job;
   }

  let target = Game.getObjectById(job.target);
  if (target) {
    let result = creep.pickup(target);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    } else if (result == OK || (!target || target.amount <= 0 || _.sum(creep.carry) === creep.carryCapacity)) {
      delete creep.memory.job;
    }
  } else {
    delete creep.memory.job;
  }
}


function withdrawEnergyAction(creep, job) {
  if (_.sum(creep.carry) === creep.carryCapacity) {
       delete creep.memory.job;
   }

  let target = Game.getObjectById(job.target);
  if (target) {
    let result = creep.withdraw(target, RESOURCE_ENERGY);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    } else if (result == OK || (!target || target.store[RESOURCE_ENERGY] <= 0 || _.sum(creep.carry) === creep.carryCapacity)) {
      delete creep.memory.job;
    }
  } else {
    delete creep.memory.job;
  }
}

function claimRoomAction(creep, job) {
  let target = creep.room.controller;
  if (creep.claimController(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
  }
}

function mineAction(creep, job) {
  var sumCarry = _.sum(creep.carry);
  if (sumCarry > 0 && sumCarry === creep.carryCapacity) {
       delete creep.memory.job;
   }

  let target = Game.getObjectById(job.target);
  if (target) {
    let result = creep.harvest(target);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    } else if (result == OK) {
      delete creep.memory.job;
    }
  } else {
    delete creep.memory.job;
  }
}

function remoteMineAction(creep, job) {
  if (creep.pos.roomName == job.room) {
    let target = creep.pos.findClosestByPath(FIND_SOURCES);

    creep.memory.job = {
      action: 'mine',
      room: creep.pos.roomName,
      target: target.id
    }
  }
}

function buildUpRoomAction(creep, job) {
  if (creep.pos.roomName == job.room) {
    if (creep.carry.energy < creep.carryCapacity) {

      if (creep.room.memory.droppedEnergy.length > 0) {
        var droppedEnergy = _.compact(_.map(creep.room.memory.droppedEnergy, de => Game.getObjectById(de.id)));
        let closest = creep.pos.findClosestByPath(droppedEnergy);
        if (closest) {
          creep.memory.job = {
            action: 'collectResource',
            room: creep.pos.roomName,
            target: closest.id
          };
        }

      } else {
        var sources = _.map(creep.room.memory.sources, s => Game.getObjectById(s.id));
        let closest = creep.pos.findClosestByPath(sources);
        if (closest) {
          creep.memory.job = {
            action: 'mine',
            room: creep.pos.roomName,
            target: closest.id
          }
        }

      }

    } else {
      let cs = creep.room.memory.constructionSites;
      if (creep.room.controller.ticksToDowngrade <= 10000 || !cs || cs.length == 0) {
        creep.memory.job = {
          action: 'upgrade',
          room: job.room,
          target: creep.room.controller.id
        };
      } else {
        let toBuild = _.head(cs);
        creep.memory.job = {
          action: 'build',
          room: job.room,
          target: toBuild.id
        };
      }
    }
  }
}

function moveToTargetRoom(creep, job) {
  let targetRoom = job.room;

  if (job.targetExit && job.targetExit.roomName == creep.pos.roomName) {
    creep.moveTo(job.targetExit.x, job.targetExit.y);
  } else {
    let route = Game.map.findRoute(creep.room, targetRoom);
    job.targetExit = creep.pos.findClosestByPath(route[0].exit);
    creep.moveTo(job.targetExit);

  }

}

module.exports = {
  build: buildAction,
  upgrade: upgradeAction,
  dumpEnergy: dumpEnergyAction,
  dumpMineral: dumpMineralAction,
  recycleSelf: recycleSelfAction,
  collectResource: collectResourceAction,
  withdrawEnergy: withdrawEnergyAction,
  claimRoom: claimRoomAction,
  mine: mineAction,
  remoteMine: remoteMineAction,
  buildUp: buildUpRoomAction,
  moveToTargetRoom: moveToTargetRoom
};
