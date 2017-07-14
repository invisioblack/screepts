const bodies = require('creeps.bodies');
const roles = require('creeps.roles');

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

    if(spawn.room.energyAvailable < 0.75 * spawn.room.energyCapacityAvailable &&
        (!rolesNum.spawnsupplier || rolesNum.spawnsupplier < 1)) {
          roles.spawnsupplier.behavior.create(spawn);
          return;
    }

    if(!rolesNum.miner || rolesNum.miner < 2) {
      roles.miner.behavior.create(spawn);
    } else if (!rolesNum.courier || rolesNum.courier < 8) {
      roles.courier.behavior.create(spawn);
    }else if (!rolesNum.upgrader || rolesNum.upgrader < 4) {
      roles.upgrader.behavior.create(spawn);
    } else if (!rolesNum.builder || rolesNum.builder < 5) {
      roles.builder.behavior.create(spawn);
    } else if (!rolesNum.repairman || rolesNum.repairman < 1) {
      roles.repairman.behavior.create(spawn);
    } else if (!rolesNum.towerfiller || rolesNum.towerfiller < 1) {
      roles.towerfiller.behavior.create(spawn);
    }else if (!rolesNum.sentinel || rolesNum.sentinel < 3) {
      roles.sentinel.behavior.create(spawn);
    }

  }
};
