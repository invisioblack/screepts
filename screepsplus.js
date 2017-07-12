function collectStats() {
  if (Memory.stats == null) {
    Memory.stats = {
      tick: Game.time
    };
  }
  Memory.stats.cpu = Game.cpu;
  Memory.stats.cpu.used = Game.cpu.getUsed();
  Memory.stats.gcl = Game.gcl;
  const memory_used = RawMemory.get().length;
  // console.log('Memory used: ' + memory_used);
  Memory.stats.memory = {
    used: memory_used,
    // Other memory stats here?
  };

  Memory.stats.rooms = {};
  _.forEach(Game.rooms, room => {
    if (room.controller && room.controller.my) {
      Memory.stats.rooms[room.name] = {
        energyAvailable: room.energyAvailable,
        energyCapacityAvailable: room.energyCapacityAvailable,
        storageCapacity: room.storage ? room.storage.store : null
      };
    }

  });

  var rolesNum = _.map(Game.creeps, creep => {
      return creep.memory.role;
    });

  rolesNum = _.countBy(rolesNum, arg => arg);

  Memory.stats.roles = rolesNum;

}

module.exports = {
  collectStats
};
