const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.ticksToLive < 200) {
      actions.recycleSelf(creep);
      return;
    }

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
      // Find a container or storage and get energy from it
      if (!actions.withdrawFromNearestStorage(creep)) {
        actions.recycleSelf(creep);
      }
    }
  },

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    return spawn.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, CARRY, CARRY], memory = {
      role: 'upgrader'
    });
  }
}
