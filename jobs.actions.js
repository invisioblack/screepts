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
  } else if (result == OK) {
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

module.exports = {
  build: buildAction
};
