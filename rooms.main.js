module.exports = {
  initRoom: (room) => {

    if (room.memory.initialized) {
      return;
    }

    room.memory.initialized = true;
    room.memory.my = room.controller && room.controller.my;

    if(!room.memory.my){
      return;
    }

    room.memory.sources = room.find(FIND_SOURCES);
    room.memory.minerals = room.find(FIND_MINERALS);
    room.memory.exits = room.find(FIND_EXIT);

  },

  roomBehavior: (room) => {
    room.memory.droppedEnergy = room.find(FIND_DROPPED_RESOURCES, {filter: {resourceType: RESOURCE_ENERGY}});

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
