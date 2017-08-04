module.exports = {
  assignJobs: (room, creeps) => {
    let hostileCreeps = room.find(FIND_HOSTILE_CREEPS, {
      filter: c => !_.includes(config.allies, c.owner.username)
    });
    let hostileStructures = room.find(FIND_HOSTILE_STRUCTURES, {
      filter: c => !_.includes(config.allies, c.owner.username)
    });
    let hostileAll = _.union(hostileCreeps, hostileStructures);

    _.forEach(creeps, scout => {
      let target = creep.pos.findClosestByPath(hostileAll);
      if (target) {
        scout.memory.job = {
          action: 'attack',
          room: target.pos.roomName,
          target: target.id
        };
      }
    });

  }
}
