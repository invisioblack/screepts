const utils = require('utils');

const addMax = (spawn, body, bodyPart) => {
  var bodyCost = utils.calculateBodyCost(body);
  var bodyPartCost = utils.calculateBodyCost([bodyPart]);

  while (bodyCost < spawn.room.energyAvailable) {
    if (bodyCost + bodyPartCost > spawn.room.energyAvailable) {
      break;
    }

    bodyCost += bodyPartCost;
    body.unshift(bodyPart);
  }
};

const createBasic = () => {
  return [WORK, CARRY, MOVE];
};

const createLargestWorker = (spawn, base = null) => {
  var body = [WORK, MOVE];
  if (base != null) {
    body = base;
  }
  addMax(spawn, body, WORK);
  return body;
};

const createFastest = (spawn, base = null) => {
  var body = [MOVE];
  if (base != null) {
    body = base;
  }
  addMax(spawn, body, MOVE);
  return body;
};

const createStrongestMelee = (spawn, base = null) => {
  var body = [MOVE];
  if (base != null) {
    body = base;
  }
  addMax(spawn, body, ATTACK);
  return body;
};

module.exports = {
  reclaimer: [
    CLAIM,
    MOVE
  ],
  reserver: [
    CLAIM, MOVE, MOVE, MOVE, MOVE
  ],

  addMax,
  createBasic,
  createLargestWorker,
  createFastest,
  createStrongestMelee
};
