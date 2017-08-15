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
      global.Cache.rooms[room.name] = global.Cache.rooms[room.name] || {};

      let droppedResources = room.find(FIND_DROPPED_RESOURCES);
      global.Cache.rooms[room.name].droppedEnergy = global.Cache.rooms[room.name].droppedEnergy || _.filter(droppedResources, {resourceType: RESOURCE_ENERGY});
      global.Cache.rooms[room.name].droppedMinerals = _.filter(droppedResources, dropped => dropped.resourceType != RESOURCE_ENERGY && dropped.resourceType != RESOURCE_POWER);
      global.Cache.rooms[room.name].structuresByType = _.groupBy(room.find(FIND_STRUCTURES), 'structureType');
      room.memory.constructionSites = room.find(FIND_CONSTRUCTION_SITES);
      room.memory.myCreeps = room.find(FIND_MY_CREEPS);
      room.memory.myCreepsByRole = _.groupBy(room.memory.myCreeps, creep => creep.memory.role);
      if (!room.memory.storageLink && global.Cache.rooms[room.name].structuresByType.link && global.Cache.rooms[room.name].structuresByType.link.length > 0) {
        room.memory.storageLink = room.storage.pos.findClosestByPath(global.Cache.rooms[room.name].structuresByType.link);
      }
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
