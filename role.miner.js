const bodies = require('creeps.bodies');

module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {

    // Init source assignments if there are none
    if (!creep.room.memory.sourcesToMiners) {
      creep.room.memory.sourcesToMiners = {};
      var sources = creep.room.memory.sources;

      for (var source in sources) {
        creep.room.memory.sourcesToMiners[sources[source].id] = null;
      }
    }

    // Find first unclaimed source and claim it
    if (!creep.memory.mySource) {
      var sources = creep.room.memory.sources;

      for (var source in creep.room.memory.sourcesToMiners) {
        if (creep.room.memory.sourcesToMiners[source] == null) {
          creep.memory.mySource = _.find(sources, {'id': source});
          creep.room.memory.sourcesToMiners[source] = creep.id;
          return;
        }
      }
    } else {
      var mySource = Game.getObjectById(creep.memory.mySource.id);
      if (creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(mySource);
      }
    }

  },

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    return spawn.createCreep(bodies.createLargestWorker(spawn, base=[WORK, WORK, WORK, WORK, WORK, MOVE]), memory = {
      role: 'miner'
    });
  }
}
