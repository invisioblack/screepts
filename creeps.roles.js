const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');

module.exports = {
  harvester: {
    behavior: roleHarvester
  },
  builder: {
    behavior: roleBuilder
  },
  upgrader: {
    behavior: roleUpgrader
  }
}
