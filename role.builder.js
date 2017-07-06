const actions = require('creeps.actions');

var roleBuilder = {

  /** @param {Creep} creep **/
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
      // Find the nearest piece of dropped energy and pick it up

      if (!actions.collectNearestDroppedEnergy(creep)) {
        // Find a container and get energy from it
        actions.withdrawFromNearestContainer(creep);
      }

    }
  }
};

module.exports = roleBuilder;
