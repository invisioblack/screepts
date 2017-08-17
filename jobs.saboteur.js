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
          filter: struct => struct.structureType == STRUCTURE_EXTENSION || struct.structureType == STRUCTURE_LINK || struct.structureType == STRUCTURE_TERMINAL
        });

        if (target) {
          saboteur.memory.job = {
            action: 'dismantle',
            room: target.pos.roomName,
            target: target.id
          };
        } else {
          target = saboteur.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: struct => struct.structureType != STRUCTURE_SPAWN && struct.structureType != STRUCTURE_CONTROLLER && struct.structureType != STRUCTURE_ROAD && struct.hits < 10000
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
      }
    });
  }
}
