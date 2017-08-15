module.exports = {
  assignJobs: (room, creeps) => {

    _.forEach(creeps, saboteur => {
      if (saboteur.pos.roomName != saboteur.memory.targetRoom) {
        saboteur.memory.job = {
          action: 'gotoTargetRoom',
          room: saboteur.memory.targetRoom,
          target: null
        }
      } else {
        let target = saboteur.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: struct => struct.structureType != STRUCTURE_SPAWN && struct.structureType != STRUCTURE_CONTROLLER
        });

        if (target) {
          saboteur.memory.job = {
            action: 'dismantle',
            room: target.pos.roomName,
            target: target.id
          };
        } else {
          let target = saboteur.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);
          if (target) {
            saboteur.memory.job = {
              action: 'dismantle',
              room: target.pos.roomName,
              target: target.id
            };
          }
        }
      }
    });
  }
}
