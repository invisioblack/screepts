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

    var roles = _.map(Game.creeps, creep => {
      return creep.memory.role;
    });

    roles = _.countBy(roles, arg => arg);

    if (spawn.energy < 200 || spawn.canCreateCreep(bodies.basic) != 0) {
      return;
    }

    if(roles.miner < 2) {
      spawn.createCreep(bodies.worker, memory={role: 'miner'});
      incOrCreate(spawn.memory.spawnStats, 'miner');
    } else if (roles.courier < 2) {
      spawn.createCreep(bodies.fast, memory={role: 'courier'});
      incOrCreate(spawn.memory.spawnStats, 'couriers');
    }else if (roles.upgrader < 2) {
      spawn.createCreep(bodies.basic, memory={role: 'upgrader'});
      incOrCreate(spawn.memory.spawnStats, 'upgraders');
    } else if (roles.builder < 4) {
      spawn.createCreep(bodies.basic, memory={role: 'builder'});
      incOrCreate(spawn.memory.spawnStats, 'builders');
    }
  }
};
