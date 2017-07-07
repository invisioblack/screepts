const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const roleMiner = require('role.miner');
const roleCourier = require('role.courier');
const roleRepairman = require('role.repairman');
const roleScout = require('role.scout');
const roleRemoteMiner = require('role.remoteminer');
const roleSentinel = require('role.sentinel');
const roleTowerFiller = require('role.towerfiller');

module.exports = {
  // Infrastructure
  builder: {
    behavior: roleBuilder
  },
  upgrader: {
    behavior: roleUpgrader
  },
  repairman: {
    behavior: roleRepairman
  },
  towerfiller: {
    behavior: roleTowerFiller
  },

  // Resource extraction
  miner: {
    behavior: roleMiner
  },
  courier: {
    behavior: roleCourier
  },
  remoteminer: {
    behavior: roleRemoteMiner
  },

  // Military
  scout: {
    behavior: roleScout
  },
  sentinel: {
    behavior: roleSentinel
  }
}
