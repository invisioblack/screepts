module.exports = {
  assignJobs: (room, creeps) => {
    _.forEach(creeps, nextroomer => {

      if (nextroomer.memory.originRoom == nextroomer.pos.roomName) {
        if (nextroomer.carry.energy == 0) {
          let target = room.storage;
          if (target && target.store[RESOURCE_ENERGY] > 300) {
            nextroomer.memory.job = {
              action: 'withdrawEnergy',
              room: nextroomer.pos.roomName,
              target: target.id
            };
          }
        } else {
          nextroomer.memory.job = {
            action: 'buildUp',
            room: nextroomer.memory.targetRoom,
            target: nextroomer.memory.targetRoom
          };
        }
      } else {
        nextroomer.memory.job = {
          action: 'buildUp',
          room: nextroomer.memory.targetRoom,
          target: nextroomer.memory.targetRoom
        };
      }

    });
  }
}
