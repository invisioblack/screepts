module.exports = {
  assignJobs: (room, creeps) => {
    let mineral = room.memory.minerals[0];
    _.forEach(creeps, excavator => {
      excavator.memory.job = {
        action: 'mine',
        room: room.name,
        target: mineral.id
      };
    });
  }
}
