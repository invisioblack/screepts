const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {

    if (creep.carry.energy > 0) {
      actions.buildNearestConstructionSite(creep);
    } else {

      if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
        if (!actions.withdrawFromNearestStorage(creep)) {
          actions.withdrawFromNearestContainer(creep);
        }
      } else {
        actions.dismantleNearestStructure(creep);
      }
    }

  },

  /** @param {StructureSpawn} spawn **/
  create: function(spawn) {
    return spawn.createCreep(bodies.createFastest(spawn, base=[MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY]), memory = {
      role: 'builder'
    });
  }
}
