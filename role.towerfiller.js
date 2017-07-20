const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      if (!actions.withdrawFromNearestContainer(creep)) {
        actions.withdrawFromNearestStorage(creep);
      }
    } else {
      var towers = _.filter(creep.room.memory.structures, {structureType: STRUCTURE_TOWER});
      var supplied = false;
      _.forEach(towers, tower => {
        if (tower.energy < tower.energyCapacity) {

          let result = creep.transfer(tower, RESOURCE_ENERGY);
          if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(tower);
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
