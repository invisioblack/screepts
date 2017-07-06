const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const roleMiner = require('role.miner');
const roleCourier = require('role.courier');
const roleRepairman = require('role.repairman');
const roleScout = require('role.scout');

module.exports = {
  builder: {
    behavior: roleBuilder
  },
  upgrader: {
    behavior: roleUpgrader
  },
  repairman: {
    behavior: roleRepairman
  },

  miner: {
    behavior: roleMiner
  },
  courier: {
    behavior: roleCourier
  },

  scout: {
    behavior: roleScout
  }
}
