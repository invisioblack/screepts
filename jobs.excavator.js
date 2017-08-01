module.exports = {
  assignJobs: (room, creeps) => {
    let mineral = room.memory.minerals[0];
    _.forEach(creeps, excavator => {
      if (_.sum(creep.carry) === creep.carryCapacity) {
        let target = room.terminal;
        if (target) {
          courier.memory.job = {
            action: 'dumpMineral',
            room: room.name,
            target: target.id
          }
        }
      } else {
        excavator.memory.job = {
          action: 'mine',
          room: room.name,
          target: mineral.id
        };
      }
    });
  }
}
