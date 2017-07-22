module.exports = {
  assignJobs: (room, creeps) => {
    _.forEach(creeps, upgrader => {

      if (upgrader.carry.energy == 0) {
        let target = room.storage;
        if (target && target.store[RESOURCE_ENERGY] > 300) {
          upgrader.memory.job = {
            action: 'withdrawEnergy',
            room: upgrader.pos.roomName,
            target: target.id
          };
        } else {
          let target = courier.pos.findClosestByPath(room.memory.structuresByType.spawn);
          upgrader.memory.job = {
            action: 'recycleSelf',
            target: target.id
          }
        }
      } else {
        let target = room.controller;
        upgrader.memory.job = {
          action: 'upgrade',
          target: target.id
        }
      }

    });
  }
}
