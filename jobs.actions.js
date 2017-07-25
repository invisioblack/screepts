function buildAction(creep, job) {
  if (creep.carry.energy == 0) {
    delete creep.memory.job;
  }

  let constructionSite = Game.getObjectById(job.target);
  if (constructionSite) {
    let result = creep.build(constructionSite);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(constructionSite);
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
    } else if(result == ERR_FULL) {
      delete creep.memory.job;
    } else if (result == OK && creep.carry.energy == 0) {
      delete creep.memory.job;
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

function collectEnergyAction(creep, job) {
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

function buildUpRoomAction(creep, job) {
  if (creep.pos.roomName == job.room) {
    if (creep.carry.energy < creep.carryCapacity) {

      if (creep.room.memory.droppedEnergy.length > 0) {
        var droppedEnergy = _.compact(_.map(creep.room.memory.droppedEnergy, de => Game.getObjectById(de.id)));
        let closest = creep.pos.findClosestByPath(droppedEnergy);
        if (closest) {
          creep.memory.job = {
            action: 'collectEnergy',
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
    console.log(creep.name, creep.pos, creep.room.name);
    job.targetExit = creep.pos.findClosestByPath(route[0].exit);
    creep.moveTo(job.targetExit);

  }

}

module.exports = {
  build: buildAction,
  upgrade: upgradeAction,
  dumpEnergy: dumpEnergyAction,
  recycleSelf: recycleSelfAction,
  collectEnergy: collectEnergyAction,
  withdrawEnergy: withdrawEnergyAction,
  claimRoom: claimRoomAction,
  mine: mineAction,
  buildUp: buildUpRoomAction,
  moveToTargetRoom: moveToTargetRoom
};
