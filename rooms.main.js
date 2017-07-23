module.exports = {
  initRoom: (room) => {

    if (room.memory.initialized) {
      return;
    }

    room.memory.initialized = true;
    console.log(room.controller);
    console.log(room.controller.my);
    room.memory.my = room.controller && room.controller.my;

    if(!room.memory.my){
      return;
    }

    room.memory.sources = room.find(FIND_SOURCES);
    room.memory.minerals = room.find(FIND_MINERALS);
    room.memory.exits = [
      room.find(FIND_EXIT_TOP),
      room.find(FIND_EXIT_BOTTOM),
      room.find(FIND_EXIT_RIGHT),
      room.find(FIND_EXIT_LEFT),
    ];

  },

  roomBehavior: (room) => {
    if (room.memory.my) {
      room.memory.droppedEnergy = room.find(FIND_DROPPED_RESOURCES, {filter: {resourceType: RESOURCE_ENERGY}});
      room.memory.structuresByType = _.groupBy(room.find(FIND_STRUCTURES), 'structureType');
      room.memory.constructionSites = room.find(FIND_CONSTRUCTION_SITES);
      room.memory.myCreeps = room.find(FIND_MY_CREEPS);
      room.memory.myCreepsByRole = _.groupBy(room.memory.myCreeps, creep => creep.memory.role);
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
