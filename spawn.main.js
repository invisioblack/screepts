const bodies = require('creeps.bodies');
const roles = require('creeps.roles');

module.exports = {
  spawnBehavior: () => {
    var roles = _.map(Game.creeps, creep => {
      return creep.memory.role;
    });

    roles = _.countBy(roles, arg => arg);

    if (Game.spawns.Spawn1.energy < 200 || Game.spawns.Spawn1.canCreateCreep(bodies.basic) != 0) {
      return;
    }

    if(roles.harvester < 2) {
      Game.spawns.Spawn1.createCreep(bodies.basic, memory={role: 'harvester'});
    } else if (roles.upgrader < 2) {
      Game.spawns.Spawn1.createCreep(bodies.basic, memory={role: 'upgrader'});
    } else if (roles.builder < 2) {
      Game.spawns.Spawn1.createCreep(bodies.basic, memory={role: 'builder'});
    }
  }
};
