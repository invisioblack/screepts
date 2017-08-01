module.exports = {
  assignJobs: (room, creeps) => {
    // Couriers
    if (!room.memory.structuresByType) {
      return;
    }
    _.forEach(creeps, courier => {
      if (courier.carry.energy > 0) {
        if (room.terminal && room.terminal.store[RESOURCE_ENERGY] < room.terminal.storeCapacity * 0.01) {
          let target = room.terminal;
          courier.memory.job = {
            action: 'dumpEnergy',
            room: room.name,
            target: target.id
          };
        } else {
          let target = courier.pos.findClosestByPath(courier.room.memory.structuresByType.spawn, {
            filter: spawn => spawn.energy < spawn.energyCapacity
          });
          if (target) {
            courier.memory.job = {
              action: 'dumpEnergy',
              room: courier.pos.roomName,
              target: target.id
            };
          } else {
            target = courier.pos.findClosestByPath(courier.room.memory.structuresByType.extension, {
              filter: ext => ext.energy < ext.energyCapacity
            });
            if (target) {
              courier.memory.job = {
                action: 'dumpEnergy',
                room: courier.pos.roomName,
                target: target.id
              };
            } else {
              target = courier.room.storage;
              if (target) {
                courier.memory.job = {
                  action: 'dumpEnergy',
                  room: courier.pos.roomName,
                  target: target.id
                }
              }
            }
          }
        }
      } else {
        let droppedEnergy = _(room.memory.droppedEnergy).map(de => Game.getObjectById(de.id)).filter(de => de.amount > 50).sortBy(de => de.amount).reverse().value();
        let target = _.head(droppedEnergy);
        if (target) {
          courier.memory.job = {
            action: 'collectResource',
            room: courier.pos.roomName,
            target: target.id
          };

          target.amount -= 300;
          if (target.amount <= 0) {
            _.remove(droppedEnergy, dropped => dropped.id == target.id);
          }
        } else if (room.memory.structuresByType.container && room.memory.structuresByType.container.length > 0) {
          var containers = _.map(_.filter(room.memory.structuresByType.container, container => container.store[RESOURCE_ENERGY] > 0), container => Game.getObjectById(container.id));
          target = courier.pos.findClosestByPath(containers);
          if(target) {
            courier.memory.job = {
              action: 'withdrawEnergy',
              room: courier.pos.roomName,
              target: target.id
            }

            target.store[RESOURCE_ENERGY] -= 300;
            if (target.amount <= 0) {
              _.remove(containers, container => container.id == target.id);
            }
          } else {
            target = courier.pos.findClosestByPath(room.memory.structuresByType.spawn);
            if (target) {
              courier.memory.job = {
                action: 'recycleSelf',
                target: target.id
              }
            }
          }
        }
      }
    });
  }
}
