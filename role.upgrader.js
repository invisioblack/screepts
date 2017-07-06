const actions = require('creeps.actions');

var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('harvest');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: {
            stroke: '#ffffff'
          }
        });
      }
    } else {
      // Find the nearest piece of dropped energy and pick it up
      if (!actions.collectNearestDroppedEnergy(creep)) {
        // Find a container and get energy from it
        actions.withdrawFromNearestContainer(creep);
      }
    }
  }
};

module.exports = roleUpgrader;
