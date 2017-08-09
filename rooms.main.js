module.exports = {
  initRoom: (room) => {

    if (room.memory.initialized) {
      return;
    }

    let memory = {};
    memory.initialized = true;
    memory.my = room.controller && room.controller.my;

    memory.sources = room.find(FIND_SOURCES);
    memory.minerals = room.find(FIND_MINERALS);
    memory.exits = [
      room.find(FIND_EXIT_TOP),
      room.find(FIND_EXIT_BOTTOM),
      room.find(FIND_EXIT_RIGHT),
      room.find(FIND_EXIT_LEFT),
    ];

    room.memory = memory;
  },

  roomBehavior: (room) => {
    if (room.memory.my) {
      let memory = room.memory;
      memory.droppedEnergy = room.find(FIND_DROPPED_RESOURCES, {filter: {resourceType: RESOURCE_ENERGY}});
      memory.droppedMinerals = room.find(FIND_DROPPED_RESOURCES, {filter: dropped => dropped.resourceType != RESOURCE_ENERGY && dropped.resourceType != RESOURCE_POWER});
      memory.structuresByType = _.groupBy(room.find(FIND_STRUCTURES), 'structureType');
      memory.constructionSites = room.find(FIND_CONSTRUCTION_SITES);
      memory.myCreeps = room.find(FIND_MY_CREEPS);
      memory.myCreepsByRole = _.groupBy(memory.myCreeps, creep => creep.memory.role);
      room.memory = memory;
    }


    if (room.executeEveryTicks(50)) {
      for (var source in room.memory.sourcesToMiners) {
        if (Game.getObjectById(room.memory.sourcesToMiners[source]) === null) {
          room.memory.sourcesToMiners[source] = null;
        }
      }
    }
  },

  underAttack: (room) => {
    return (room.memory.my && room.find(FIND_HOSTILE_CREEPS).length > 0);
  }
};
