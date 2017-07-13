const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {

    if (creep.memory.building === undefined) {
      creep.memory.building = true;
    }

    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('harvest');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('build');
    }

    if (creep.memory.building) {
      actions.buildNearestConstructionSite(creep);
    } else {
      if (!actions.withdrawFromNearestContainer(creep)) {
        actions.withdrawFromNearestStorage(creep);
      }
    }
  },

  /** @param {StructureSpawn} spawn **/
  create: function(spawn) {
    return spawn.createCreep(bodies.createFastest(spawn, base=[MOVE, WORK, WORK, CARRY]), memory = {
      role: 'builder'
    });
  }
}
