const bodies = require('creeps.bodies');
const roles = require('creeps.roles');
const priorities = require('jobs.priorities');

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


    if (_.includes(spawn.room.memory.sourcesToMiners, null) && !isQueued(spawnQueue, 'miner')) {
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
      spawnQueue = _.sortBy(spawnQueue, item => {
        let priority = priorities.SPAWNING_PRIORITIES[item.role];
        if (priority) {
          return 100-priority;
        } else {
          return 50;
        }
      });
      let creepToSpawn = _.head(spawnQueue);


      let result = roles[creepToSpawn.role].behavior.create(spawn, memory=creepToSpawn.memory);
      if (typeof result == 'string') {
        spawn.room.memory.spawnQueue = _.tail(spawnQueue);
      }

      return;
    }

  }
};
