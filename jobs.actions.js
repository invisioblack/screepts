function buildAction(creep, job) {
  let constructionSite = Game.getObjectById(job.target);
  if (constructionSite) {
    let result = creep.build(constructionSite);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(constructionSite);
    } else if (result == OK) {
      delete creep.memory.job;
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
    } else if (result == OK) {
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
  if(creep.claimController(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
  }
}

function moveToTargetRoom(creep, job){
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
  recycleSelf: recycleSelfAction,
  collectEnergy: collectEnergyAction,
  withdrawEnergy: withdrawEnergyAction,
  claimRoom: claimRoomAction,
  moveToTargetRoom: moveToTargetRoom
};
