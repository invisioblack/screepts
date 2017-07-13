const bodies = require('creeps.bodies');
const roles = require('creeps.roles');

function incOrCreate(collection, key) {
    if (!collection[key]) {
        collection[key] = 1;
    } else {
        collection[key] += 1;
    }
}

module.exports = {
  spawnBehavior: (spawn) => {
      if(!spawn.memory.spawnStats) {
          spawn.memory.spawnStats = {};
      }

    var rolesNum = _.map(Game.creeps, creep => {
      return creep.memory.role;
    });

    rolesNum = _.countBy(rolesNum, arg => arg);

    if (spawn.energy < 200 || spawn.canCreateCreep(bodies.createBasic()) != 0) {
      return;
    }

    if(!rolesNum.miner || rolesNum.miner < 2) {
      roles.miner.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'miner');
    } else if (!rolesNum.courier || rolesNum.courier < 8) {
      roles.courier.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'couriers');
    }else if (!rolesNum.upgrader || rolesNum.upgrader < 4) {
      roles.upgrader.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'upgraders');
    } else if (!rolesNum.builder || rolesNum.builder < 5) {
      roles.builder.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'builders');
    } else if (!rolesNum.repairman || rolesNum.repairman < 1) {
      roles.repairman.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'repairmen');
    } else if (!rolesNum.towerfiller || rolesNum.towerfiller < 1) {
      roles.towerfiller.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'towerfiller');
    }else if (!rolesNum.sentinel || rolesNum.sentinel < 3) {
      roles.sentinel.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'sentinel');
    } else if (!rolesNum.remoteminer || rolesNum.remoteminer < 1) {
      roles.remoteminer.behavior.create(spawn);
      incOrCreate(spawn.memory.spawnStats, 'remoteminer');
    }
  }
};
