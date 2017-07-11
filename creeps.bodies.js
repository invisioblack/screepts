module.exports = {
  basic: [WORK, WORK, CARRY, MOVE],
  worker: [WORK, WORK, WORK, WORK, WORK, MOVE],
  fast: [MOVE, MOVE, MOVE, MOVE, CARRY],
  scout: [MOVE, MOVE, MOVE, ATTACK, ATTACK],
  sentinel: [TOUGH, ATTACK, ATTACK, ATTACK, MOVE],
  reclaimer: [CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, MOVE],
  remoteminer: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
  reserver: [CLAIM, MOVE, MOVE, MOVE, MOVE]
};
