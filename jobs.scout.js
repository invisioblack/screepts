module.exports = {
  assignJobs: (creeps) => {
    _.forEach(creeps, scout => {

      let hostileCreeps = scout.room.find(FIND_HOSTILE_CREEPS, {
        filter: c => !_.includes(config.allies, c.owner.username)
      });
      let hostileStructures = scout.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: c => !_.includes(config.allies, c.owner.username)
      });
      let hostileAll = _.union(hostileCreeps, hostileStructures);

      let target = scout.pos.findClosestByPath(hostileAll);
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
