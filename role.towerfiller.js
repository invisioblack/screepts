const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      actions.withdrawFromNearestStorage(creep);
    } else {

      let tower = Game.getObjectById(creep.memory.target);
      if (tower.energy < tower.energyCapacity) {

        let target = Game.getObjectById(tower.id);
        let result = creep.transfer(target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }

    }
  },

  create: function(spawn, memory) {
    return spawn.createCreep(bodies.createBasic(), memory = Object.assign({}, {role: 'towerfiller'}, memory));
  }
}
