const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const roleMiner = require('role.miner');
const roleCourier = require('role.courier');
const roleRepairman = require('role.repairman');
const roleScout = require('role.scout');
const roleRemoteMiner = require('role.remoteminer');
const roleSentinel = require('role.sentinel');
const roleTowerFiller = require('role.towerfiller');
const roleReclaimer = require('role.reclaimer');
const roleReserver = require('role.reserver');
const roleSpawnSupplier = require('role.spawnsupplier');
const roleNextroomer = require('role.nextroomer');
const roleExcavator = require('role.excavator');
const roleMineralCourier = require('role.mineralCourier');

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
  spawnsupplier: {
    behavior: roleSpawnSupplier
  },
  nextroomer: {
    behavior: roleNextroomer
  },
  mineralCourier: {
    behavior: roleMineralCourier
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
  excavator: {
    behavior: roleExcavator
  },

  // Military
  scout: {
    behavior: roleScout
  },
  sentinel: {
    behavior: roleSentinel
  },
  reclaimer: {
    behavior: roleReclaimer
  },
  reserver: {
    behavior: roleReserver
  }
}
