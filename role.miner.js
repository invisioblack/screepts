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
      let result = creep.harvest(mySource)
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(mySource);
      } else if (result == OK) {
        let structs = creep.pos.lookFor(LOOK_STRUCTURES);
        let sites = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
        if (!_.any(_.union(structs, sites), 'structureType', 'container')) {
          creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
        }
      }
    }
  },

  sizes: [
    [WORK, MOVE],
    [WORK, WORK, WORK, MOVE],
    [WORK, WORK, WORK, WORK, WORK, MOVE]
  ],

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = {
        role: 'miner'
      });
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }


  }
}
