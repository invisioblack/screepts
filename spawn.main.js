const bodies = require('creeps.bodies');
const roles = require('creeps.roles');

module.exports = {
  spawnBehavior: (spawn) => {
    spawn.room.memory.spawnQueue = [];

    var rolesNum = _.map(Game.creeps, creep => {
      return creep.memory.role;
    });
    rolesNum = _.countBy(rolesNum, arg => arg);

    if(spawn.room.energyAvailable < 0.35 * spawn.room.energyCapacityAvailable &&
        (!rolesNum.spawnsupplier || rolesNum.spawnsupplier < 1)) {
          roles.spawnsupplier.behavior.create(spawn);
          return;
    }

    for (var i=0; i < spawn.room.memory.sources.length - rolesNum.miner; i++) {
      spawn.room.memory.spawnQueue.push('miner');
    }

    _.forEach(spawn.room.find(FIND_DROPPED_RESOURCES, {
      filter: {resourceType: RESOURCE_ENERGY}
    }), dropped => {
      var requiredCouriers = Math.floor(amount/100);
      for (var i=0; i<requiredCouriers; i++) {
        spawn.room.memory.spawnQueue.push('courier');
      }
    });

    for(var i=0; i < spawn.room.find(FIND_CONSTRUCTION_SITES) - rolesNum.builder; i++) {
      spawn.room.memory.spawnQueue.push('builder');
    }

    if (spawn.room.memory.spawnQueue.length > 0) {
      let creepToSpawn = _.head(spawn.room.memory.spawnQueue);
      spawn.room.memory.spawnQueue = _.tail(spawn.room.memory.spawnQueue);

      roles[creepToSpawn].behavior.create(spawn);
      return;
    }

    if (!rolesNum.upgrader || rolesNum.upgrader < 6) {
      roles.upgrader.behavior.create(spawn);
    } else if (!rolesNum.repairman || rolesNum.repairman < 1) {
      roles.repairman.behavior.create(spawn);
    } else if (!rolesNum.towerfiller || rolesNum.towerfiller < 1) {
      roles.towerfiller.behavior.create(spawn);
    }else if (!rolesNum.sentinel || rolesNum.sentinel < 1) {
      roles.sentinel.behavior.create(spawn);
    }

  }
};
