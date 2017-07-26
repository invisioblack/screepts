module.exports = {
  assignJobs: (room, creeps) => {
    _.forEach(creeps, builder => {

      if (builder.carry.energy == 0) {
        let target = room.storage;
        if (target && target.store[RESOURCE_ENERGY] > 300) {
          builder.memory.job = {
            action: 'withdrawEnergy',
            room: builder.pos.roomName,
            target: target.id
          };
        } else {
          let droppedEnergy = _.map(room.memory.droppedEnergy, de => Game.getObjectById(de.id));
          let target = builder.pos.findClosestByPath(droppedEnergy);
          if (target) {
            builder.memory.job = {
              action: 'collectEnergy',
              room: builder.pos.roomName,
              target: target.id
            };
          } else {
            builder.memory.role = 'upgrader';
          }
        }
      } else {
        let target = builder.pos.findClosestByPath(room.memory.constructionSites);
        if (target) {
          builder.memory.job = {
            action: 'build',
            room: builder.pos.roomName,
            target: target.id
          }
        }
      }

    });
  }
}
