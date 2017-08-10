module.exports = {
  assignJobs: (room, creeps) => {

    _.forEach(creeps, miner => {
      let originRoom = Game.rooms[miner.memory.originRoom];
      let targetRoom = Game.rooms[miner.memory.targetRoom];

      let links = _.map(originRoom.memory.structuresByType.link, link => Game.getObjectById(link.id));
      let storageLink = Game.getObjectById(originRoom.memory.storageLink.id);

      if (miner.pos.roomName != miner.memory.targetRoom) {
        if (miner.carry.energy > 0) {
          let target = originRoom.storage;
          if (target) {
            miner.memory.job = {
              action: 'dumpEnergy',
              room: miner.memory.originRoom,
              target: target.id
            };

          } else {
            let target = originRoom.controller.pos.findClosestByPath(originRoom.memory.structuresByType.extension, {
              filter: ext => ext.energy < ext.energyCapacity
            });

            if (target) {
              miner.memory.job = {
                action: 'dumpEnergy',
                room: miner.memory.originRoom,
                target: target.id
              };
            }
          }
        } else {
          miner.memory.job = {
            action: 'remoteMine',
            room: miner.memory.targetRoom,
            target: null
          };

        }

      } else {
        if (miner.carry.energy < miner.carryCapacity) {
          let target = miner.pos.findClosestByPath(FIND_SOURCES, {
              filter: source => source.energy > 0
          });
          if (target) {
            miner.memory.job = {
              action: 'mine',
              room: miner.pos.roomName,
              target: target.id
            }
          }
        } else {
          let closestLink = miner.pos.findClosestByPath(links, {
            filter: link => link.energy < link.energyCapacity && (storageLink ? link.id != storageLink.id : true)
          });

          let target = originRoom.storage;

          if (closestLink && miner.pos.findPathTo(closestLink).length < miner.pos.findPathTo(target).length) {
            target = closestLink;
          }


          if (target) {
            miner.memory.job = {
              action: 'dumpEnergy',
              room: miner.memory.originRoom,
              target: target.id
            };

          } else {
            let target = originRoom.controller.pos.findClosestByPath(originRoom.memory.structuresByType.extension, {
              filter: ext => ext.energy < ext.energyCapacity
            });

            if (target) {
              miner.memory.job = {
                action: 'dumpEnergy',
                room: miner.memory.originRoom,
                target: target.id
              };
            }
          }
        }
      }

    });
  }
}
