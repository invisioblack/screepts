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

          let droppedEnergy = _.map(room.memory.droppedEnergy, de => Game.getObjectById(de.id));
          let target = upgrader.pos.findClosestByPath(droppedEnergy);
          if(target) {
            upgrader.memory.job = {
              action: 'collectEnergy',
              room: upgrader.pos.roomName,
              target: target.id
            };
          } else {
            target = upgrader.pos.findClosestByPath(room.memory.structuresByType.spawn);
            upgrader.memory.job = {
              action: 'recycleSelf',
              target: target.id
            };
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
