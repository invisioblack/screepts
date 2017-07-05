const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const roleMiner = require('role.miner');
const roleCourier = require('role.courier');

module.exports = {
  harvester: {
    behavior: roleHarvester
  },
  builder: {
    behavior: roleBuilder
  },
  upgrader: {
    behavior: roleUpgrader
  },

  miner: {
    behavior: roleMiner
  },
  courier: {
    behavior: roleCourier
  }
}
