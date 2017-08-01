module.exports = {
  assignJobs: (room, creeps) => {

    _.forEach(creeps, courier => {
      if (_.sum(courier.carry) > 0) {
        let target = room.terminal;
        if (target) {
          courier.memory.job = {
            action: 'dumpMineral',
            room: room.name,
            target: target.id
          }
        }
      } else {
        let target = courier.pos.findClosestByPath(room.memory.droppedMinerals);
        if (target) {
          courier.memory.job = {
            action: 'collectResource',
            room: room.name,
            target: target.id
          };
        }
      }
    });
  }
}
