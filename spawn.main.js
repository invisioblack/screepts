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
  spawnBehavior: () => {
      if(!Game.spawns.Spawn1.memory.spawnStats) {
          Game.spawns.Spawn1.memory.spawnStats = {};
      }

    var roles = _.map(Game.creeps, creep => {
      return creep.memory.role;
    });

    roles = _.countBy(roles, arg => arg);

    if (Game.spawns.Spawn1.energy < 200 || Game.spawns.Spawn1.canCreateCreep(bodies.basic) != 0) {
      return;
    }

    if(roles.miner < 2) {
      Game.spawns.Spawn1.createCreep(bodies.worker, memory={role: 'miner'});
      incOrCreate(Game.spawns.Spawn1.memory.spawnStats, 'miner');
    } else if (roles.courier < 2) {
      Game.spawns.Spawn1.createCreep(bodies.fast, memory={role: 'courier'});
      incOrCreate(Game.spawns.Spawn1.memory.spawnStats, 'couriers');
    }else if (roles.upgrader < 2) {
      Game.spawns.Spawn1.createCreep(bodies.basic, memory={role: 'upgrader'});
      incOrCreate(Game.spawns.Spawn1.memory.spawnStats, 'upgraders');
    } else if (roles.builder < 4) {
      Game.spawns.Spawn1.createCreep(bodies.basic, memory={role: 'builder'});
      incOrCreate(Game.spawns.Spawn1.memory.spawnStats, 'builders');
    }
  }
};
