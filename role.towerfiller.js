const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      actions.withdrawFromNearestStorage(creep);
    } else {
      var towers = _.filter(creep.room.memory.structures, {structureType: STRUCTURE_TOWER});
      var supplied = false;
      _.forEach(towers, tower => {
        if (tower.energy < tower.energyCapacity) {

          let target = Game.getObjectById(tower.id);
          let result = creep.transfer(target, RESOURCE_ENERGY);
          if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
          supplied = true;

        }
      });

      if (!supplied) {
        actions.recycleSelf(creep);
      }

    }
  },

  create: function(spawn) {
    return spawn.createCreep(bodies.createBasic(), memory = {
      role: 'towerfiller'
    });
  }
}
