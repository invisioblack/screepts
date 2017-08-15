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
          let containers = _.map(_.filter(global.Cache.rooms[room.name].structuresByType.container, container => container.store[RESOURCE_ENERGY] > 100), container => Game.getObjectById(container.id));
          let target = builder.pos.findClosestByPath(containers);
          if (target) {
            builder.memory.job = {
              action: 'withdrawEnergy',
              room: builder.pos.roomName,
              target: target.id
            }
          } else {
            let droppedEnergy = _(global.Cache.rooms[room.name].droppedEnergy).map(de => Game.getObjectById(de.id)).filter(de => de.amount > 50).sortBy(de => de.amount).reverse().value();
            //let target = builder.pos.findClosestByPath(droppedEnergy);
            let target = _.head(droppedEnergy);
            if (target) {
              builder.memory.job = {
                action: 'collectResource',
                room: builder.pos.roomName,
                target: target.id
              };
            }
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
