module.exports = {
  assignJobs: (room, creeps) => {
    // Couriers
    if (!room.memory.structuresByType) {
      return;
    }

    var droppedEnergy = _.map(room.memory.droppedEnergy, de => Game.getObjectById(de.id));
    _.forEach(creeps, courier => {
      if (courier.carry.energy > 0) {
        let target = courier.pos.findClosestByPath(courier.room.memory.structuresByType.spawn);
        if (target) {
          courier.memory.job = {
            action: 'dumpEnergy',
            room: courier.pos.roomName,
            target: target.id
          };
        } else {
          target = courier.pos.findClosestByPath(courier.room.memory.structuresByType.extension);
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
      } else {
        let target = courier.pos.findClosestByPath(droppedEnergy);
        if (target) {
          courier.memory.job = {
            action: 'collectEnergy',
            room: courier.pos.roomName,
            target: target.id
          };

          target.amount -= 300;
          if (target.amount <= 0) {
            _.remove(droppedEnergy, dropped => dropped.id == target.id);
          }
        } else if (room.memory.structuresByType.container && room.memory.structuresByType.length > 0) {
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
