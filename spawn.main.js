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

    if (spawn.room.memory.sources.length - (rolesNum.miner || 0) > 0) {
      spawn.room.memory.spawnQueue.push({role: 'miner'});
    }

    var totalDropped = _.sum(_.map(spawn.room.memory.droppedEnergy, dropped => dropped.amount));
    if (Math.floor(totalDropped/300) - (rolesNum.courier || 0) > 0) {
      if (!(rolesNum.courier && rolesNum.courier > 10)) {
        spawn.room.memory.spawnQueue.push({role: 'courier'});
      }
    }

    if((spawn.room.memory.constructionSites.length/3) - (rolesNum.builder || 0) > 0) {
      if(spawn.room.storage.store[RESOURCE_ENERGY]/spawn.room.storage.storeCapacity > 0.005) {
        spawn.room.memory.spawnQueue.push({role: 'builder'});
      }
    }

    var towers = _.filter(spawn.room.memory.structuresByType.tower, struct => struct.energy > struct.energyCapacity);
    for(var i=0; i<towers.length - (spawn.room.memory.myCreepsByRole.towerfiller || 0); i++) {
      spawn.room.memory.spawnQueue.push({role: 'towerfiller', memory: { target: towers[i].id }});
    }

    if(spawn.room.storage.store[RESOURCE_ENERGY]/spawn.room.storage.storeCapacity > 0.0045) {
      spawn.room.memory.spawnQueue.push({role: 'upgrader'});
    }

    if (!rolesNum.repairman || rolesNum.repairman < 1) {
      spawn.room.memory.spawnQueue.push({role: 'repairman'});
    }

    if (!rolesNum.sentinel || rolesNum.sentinel < 1) {
      spawn.room.memory.spawnQueue.push({role: 'sentinel'});
    }

    if (spawn.room.memory.spawnQueue.length > 0) {
      let creepToSpawn = _.head(spawn.room.memory.spawnQueue);
      spawn.room.memory.spawnQueue = _.tail(spawn.room.memory.spawnQueue);

      roles[creepToSpawn.role].behavior.create(spawn, memory=creepToSpawn.memory);
      return;
    }

  }
};
