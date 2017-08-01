const bodies = require('creeps.bodies');
const roles = require('creeps.roles');

function isQueued(spawnQueue, role) {
  return _.some(spawnQueue, item => item.role == role);
}

module.exports = {
  isQueued: isQueued,
  spawnBehavior: (spawn) => {
    if (!spawn.room.memory.spawnQueue) {
      spawn.room.memory.spawnQueue = [];
    }
    let spawnQueue = spawn.room.memory.spawnQueue;

    var rolesNum = _.countBy(_.map(spawn.room.memory.myCreeps, creep => Game.getObjectById(creep.id)), creep => creep.memory.role);

    if(spawn.room.energyAvailable < 0.35 * spawn.room.energyCapacityAvailable &&
        spawn.room.storage &&
        spawn.room.storage.store[RESOURCE_ENERGY] > 0 &&
        (!rolesNum.spawnsupplier || rolesNum.spawnsupplier < 1)) {
          if (roles.spawnsupplier.behavior.create(spawn) == OK)
            return;
    }

    if ((spawn.energy == spawn.energyCapacity || spawn.room.energyAvailable >= 0.33*spawn.room.energyCapacityAvailable) &&
        spawn.room.memory.sources.length - (rolesNum.miner || 0) > 0 &&
        !isQueued(spawnQueue, 'miner')) {
      spawnQueue.push({role: 'miner'});
    }

    if (roles.excavator.behavior.spawnCondition(spawn) && !isQueued(spawnQueue, 'excavator')) {
      spawnQueue.push({role: 'excavator'});
    }

    if (roles.courier.behavior.spawnCondition(spawn) && !isQueued(spawnQueue, 'courier')) {
      spawnQueue.push({role: 'courier'});
    }

    if (roles.upgrader.behavior.spawnCondition(spawn) && !isQueued(spawnQueue, 'upgrader')) {
      spawnQueue.push({role: 'upgrader'});
    }

    if (roles.builder.behavior.spawnCondition(spawn) && !isQueued(spawnQueue, 'builder')) {
      spawnQueue.push({role: 'builder'});
    }

    if (roles.towerfiller.behavior.spawnCondition(spawn) && !isQueued(spawnQueue, 'towerfiller')) {
      spawnQueue.push({role: 'towerfiller'});
    }


    let damaged = _.filter(spawn.room.memory.structures, s => s.structureType != STRUCTURE_ROAD && s.hits < s.hitsMax*0.75);
    if ((!rolesNum.repairman || rolesNum.repairman < 1) && damaged.length > 0 && !isQueued(spawnQueue, 'repairman')) {
      spawnQueue.push({role: 'repairman'});
    }

    if (spawnQueue.length > 0) {
      let creepToSpawn = _.head(spawnQueue);
      spawn.room.memory.spawnQueue = _.tail(spawnQueue);

      roles[creepToSpawn.role].behavior.create(spawn, memory=creepToSpawn.memory);
      return;
    }

  }
};
