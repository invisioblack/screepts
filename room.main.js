module.exports = {
  roomBehavior: (room) => {
    for (var source in room.memory.sourcesToMiners) {
      if (Game.getObjectById(room.memory.sourcesToMiners[source]) === null) {
        room.memory.sourcesToMiners[source] = null;
      }
    }
  }
};
