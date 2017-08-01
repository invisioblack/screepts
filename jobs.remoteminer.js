module.exports ={
  assignJobs: (room, creeps) => {
    _.forEach(creeps, miner => {
      let originRoom = Game.rooms[miner.memory.originRoom];
      let targetRoom = Game.rooms[miner.memory.targetRoom];

      if (miner.carry.energy < miner.carryCapacity) {
          if(miner.pos.roomName != miner.memory.targetRoom) {
            miner.memory.job = {
              action: 'remoteMine',
              room: miner.memory.targetRoom,
              target: null
            };
          } else {
            let target = miner.pos.findClosestByPath(FIND_SOURCES);
            if (target) {
              miner.memory.job = {
                action: 'mine',
                room: miner.pos.roomName,
                target: target.id
              }
            }
          }

      } else {
        let target = originRoom.storage;
        if (target) {
          miner.memory.job = {
            action: 'dumpEnergy',
            room: miner.memory.originRoom,
            target: target.id
          };

        } else {
          let target = originRoom.controller.pos.findClosestByPath(
            originRoom.memory.structuresByType.extension,
            {filter: ext => ext.energy < ext.energyCapacity}
          );

          if(target) {
            miner.memory.job = {
              action: 'dumpEnergy',
              room: miner.memory.originRoom,
              target: target.id
            };
          }
        }
      }

    });
  }
}
