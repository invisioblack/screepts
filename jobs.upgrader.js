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
          let containers = _.map(_.filter(room.memory.structuresByType.container, container => container.store[RESOURCE_ENERGY] > 100), container => Game.getObjectById(container.id));
          let target = upgrader.pos.findClosestByPath(containers);
          if (target) {
            upgrader.memory.job = {
              action: 'withdrawEnergy',
              room: upgrader.pos.roomName,
              target: target.id
            }
          } else {
            let droppedEnergy = _(room.memory.droppedEnergy).map(de => Game.getObjectById(de.id)).filter(de => de.amount > 50).sortBy(de => de.amount).reverse().value();
            //let target = upgrader.pos.findClosestByPath(droppedEnergy);
            let target = _.head(droppedEnergy);
            if (target) {
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
