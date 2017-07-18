/*
  Return true if job is considered completed, false otherwise
*/
function buildAction(creep, job) {
  let constructionSite = Game.getObjectById(job.target);
  if (constructionSite) {
    let result = creep.build(constructionSite);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(constructionSite);
      return false;
    } else if (result == OK) {
      delete creep.memory.job;
      return true;
    }
  } else {
    delete creep.memory.job;
    return true;
  }
}

function upgradeAction(creep, job) {
  let result = creep.upgradeController(creep.room.controller);
  if (result == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller);
    return false;
  } else if (result == OK) {
    delete creep.memory.job;
    return true;
  }
}

function dumpEnergyAction(creep, job) {
  let target = Game.getObjectById(job.target);
  if (target) {
    let result = creep.transfer(target, RESOURCE_ENERGY);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
      return false;
    } else if (result == OK) {
      delete creep.memory.job;
      return true;
    }
  } else {
    delete creep.memory.job;
    return true;
  }
}

module.exports = {
  build: buildAction
};
