const utils = require('utils');

module.exports = {
  basic: [WORK, WORK, CARRY, MOVE],
  worker: [WORK, MOVE],
  fast: [MOVE, CARRY],
  scout: [MOVE, MOVE, MOVE, ATTACK, ATTACK],
  sentinel: [TOUGH, ATTACK, ATTACK, ATTACK, MOVE],
  reclaimer: [CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, MOVE],
  remoteminer: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
  reserver: [CLAIM, MOVE, MOVE, MOVE, MOVE],

  createBasic: () => {
    return [WORK, CARRY, MOVE];
  },

  createLargestWorker: (spawn, base=null) => {
    var body = [WORK, MOVE];
    if (base != null) {
      body = base;
    }

    while(utils.calculateBodyCost(body) < spawn.room.energyAvailable) {
      if (utils.calculateBodyCost(body) + utils.calculateBodyCost([WORK]) > spawn.room.energyAvailable) {
        break;
      }
      body.unshift(WORK);
    }

    console.log(utils.calculateBodyCost(body), '/', spawn.room.energyAvailable);

    return body;
  },
  createFastest: (spawn, base=null) => {
    var body = [MOVE];
    if (base != null) {
      body = base;
    }

    while(utils.calculateBodyCost(body) < spawn.room.energyAvailable) {
      if (utils.calculateBodyCost(body) + utils.calculateBodyCost([MOVE]) > spawn.room.energyAvailable) {
        break;
      }
      body.unshift(MOVE);
    }
    return body;
  }
};
