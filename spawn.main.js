const bodies = require('creeps.bodies');
const roles = require('creeps.roles');

function checkIfQueued(spawnQueue, role) {
  return !_.some(spawnQueue, item => item.role == role);
}

module.exports = {
  checkIfQueued: checkIfQueued,
  spawnBehavior: (spawn) => {
    if (!spawn.room.memory.spawnQueue) {
      spawn.room.memory.spawnQueue = [];
    }
    let spawnQueue = spawn.room.memory.spawnQueue;

    var rolesNum = _.countBy(_.map(spawn.room.memory.myCreeps, creep => Game.getObjectById(creep.id)), creep => creep.memory.role);

    if(spawn.room.energyAvailable < 0.35 * spawn.room.energyCapacityAvailable &&
        (!rolesNum.spawnsupplier || rolesNum.spawnsupplier < 1)) {
          if (roles.spawnsupplier.behavior.create(spawn) == OK)
            return;
    }

    if (spawn.room.memory.sources.length - (rolesNum.miner || 0) > 0 && !checkIfQueued(spawnQueue, 'miner')) {
      spawnQueue.push({role: 'miner'});
    }

    if (roles.courier.behavior.spawnCondition(spawn) && !checkIfQueued((spawnQueue, 'courier'))) {
      spawnQueue.push({role: 'courier'});
    }

    if(roles.upgrader.behavior.spawnCondition(spawn) && !checkIfQueued(spawnQueue, 'upgrader')) {
      spawnQueue.push({role: 'upgrader'});
    }

    if((spawn.room.memory.constructionSites.length/3) - (rolesNum.builder || 0) > 0  && !checkIfQueued(spawnQueue, 'builder')) {
      if(!spawn.room.storage || spawn.room.storage.store[RESOURCE_ENERGY]/spawn.room.storage.storeCapacity > 0.005) {
        spawnQueue.push({role: 'builder'});
      }
    }

    var towers = _.filter(spawn.room.memory.structuresByType.tower, struct => struct.energy > struct.energyCapacity);
    for(var i=0; i<towers.length - (spawn.room.memory.myCreepsByRole.towerfiller || 0); i++) {
      if(checkIfQueued(spawnQueue, 'towerfiller')) {
        spawnQueue.push({role: 'towerfiller', memory: { target: towers[i].id }});
      }
    }

    let damaged = _.filter(spawn.room.memory.structures, s => s.structureType != STRUCTURE_ROAD && s.hits < s.hitsMax*0.75);
    if ((!rolesNum.repairman || rolesNum.repairman < 1) && damaged.length > 0 && !checkIfQueued(spawnQueue, 'repairman')) {
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
