module.exports = {
  assignJobs: (room, creeps) => {
    // Couriers
    if (!room.memory.structuresByType || ! room.memory.structuresByType.container || !room.memory.droppedEnergy) {
      return;
    }
    var containers = _.map(_.filter(room.memory.structuresByType.container, container => container.store[RESOURCE_ENERGY] > 0), container => Game.getObjectById(container.id));
    var droppedEnergy = _.map(room.memory.droppedEnergy, de => Game.getObjectById(de.id));
    _.forEach(creeps, courier => {
      if (courier.carry.energy > 0) {
        return;
      }

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
      } else {
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
    });
  }
}
