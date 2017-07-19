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

    for (var i=0; i < spawn.room.memory.sources.length - (rolesNum.miner || 0); i++) {
      spawn.room.memory.spawnQueue.push('miner');
    }

    var totalDropped = _.sum(_.map(spawn.room.find(FIND_DROPPED_RESOURCES, {
      filter: {resourceType: RESOURCE_ENERGY}
    }), dropped => dropped.amount));
    if (Math.floor(totalDropped/300) - (rolesNum.courier || 0) > 0) {
      spawn.room.memory.spawnQueue.push('courier');
    }

    for(var i=0; i < (spawn.room.find(FIND_CONSTRUCTION_SITES).length/3) - (rolesNum.builder || 0); i++) {
      if(spawn.room.storage.store[RESOURCE_ENERGY]/spawn.room.storage.storeCapacity > 0.005) {
        spawn.room.memory.spawnQueue.push('builder');
      }
    }

    if (!rolesNum.upgrader || rolesNum.upgrader < 6) {
      if(spawn.room.storage.store[RESOURCE_ENERGY]/spawn.room.storage.storeCapacity > 0.005) {
        spawn.room.memory.spawnQueue.push('upgrader');
      }
    } else if (!rolesNum.repairman || rolesNum.repairman < 1) {
      spawn.room.memory.spawnQueue.push('repairman');
    } else if (!rolesNum.towerfiller || rolesNum.towerfiller < 1) {
      spawn.room.memory.spawnQueue.push('towerfiller');
    } else if (!rolesNum.sentinel || rolesNum.sentinel < 1) {
      spawn.room.memory.spawnQueue.push('sentinel');
    }

    if (spawn.room.memory.spawnQueue.length > 0) {
      let creepToSpawn = _.head(spawn.room.memory.spawnQueue);
      spawn.room.memory.spawnQueue = _.tail(spawn.room.memory.spawnQueue);

      roles[creepToSpawn].behavior.create(spawn);
      return;
    }

  }
};
