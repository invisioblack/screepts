const utils = require('utils');

const actions = require('jobs.actions');
const priorities = require('jobs.priorities');

const builderJobs = require('jobs.builder');
const courierJobs = require('jobs.courier');
const upgraderJobs = require('jobs.upgrader');
const reclaimerJobs = require('jobs.reclaimer');
const nextroomerJobs = require('jobs.nextroomer');

hivemind = {};

hivemind.visualizePlans = (room) => {
  if (room.memory.plan && room.memory.plan.roads) {
    for (var road in room.memory.plan.roads) {
      room.visual.poly(room.memory.plan.roads[road], {
        stroke: '#FFFFFF',
        opacity: 0.5,
        strokeWidth: 0.1
      });
    }
  }

  if (room.memory.plan && room.memory.plan.spawn) {
    room.visual.text('Z', room.memory.plan.spawn);
  }

  if (room.memory.plan && room.memory.plan.storage) {
    room.visual.text('S', room.memory.plan.storage);
  }

  if (room.memory.plan && room.memory.plan.upgrader) {
    room.visual.text('U', room.memory.plan.upgrader);
  }

  if (room.memory.plan && room.memory.plan.towers) {
    _.forEach(room.memory.plan.towers, tower => {
      if (tower) {
        room.visual.text('T', tower);
      }
    });
  }

  if (room.memory.plan && room.memory.plan.extensions) {
    _.forEach(room.memory.plan.extensions, extension => {
      if (extension) {
        room.visual.text('E', extension);
      }
    });
  }

  if (room.memory.plan && room.memory.plan.dismantle) {
    _.forEach(room.memory.plan.dismantle, dismantle => {
      if (dismantle) {
        room.visual.text('X', dismantle, {color: 'red'});
      }
    });
  }
};

hivemind.designRoom = room => {
  if (room.memory.my) {
    let plan = {};

    // Place spawn
    plan.spawn = room.controller.pos.findNearPosition().next().value
                                    .findNearPosition().next().value
                                    .findNearPosition().next().value
                                    .findNearPosition().next().value;

    // Place storage
    plan.storage = room.controller.pos.findNearPosition().next().value
                                      .findNearPosition().next().value;

    // Place roads
    let roads = [];

    let sources = room.memory.sources;

    // Connect sources to storage
    _.forEach(sources, source => {
      let road = hivemind.roadFromTo(plan.storage, source.pos);
      roads.push(road.path);
    });

    // Connect exits to storage
    _.forEach(room.memory.exits, exit => {
      if (exit) {
        let closestExit = plan.storage.findClosestByPath(_.map(exit, e => room.getPositionAt(e.x, e.y)));
        if (closestExit) {
          let road = hivemind.roadFromTo(plan.storage, closestExit, range=0);
          roads.push(road.path);
        }
      }
    });

    //Connect mineral to storage
    let mineral = room.memory.minerals[0].pos;
    let road = hivemind.roadFromTo(plan.storage, room.getPositionAt(mineral.x, mineral.y));
    roads.push(road.path);

    plan.roads = roads;

    // Place structures in a checkerboard pattern around the storage
    let checkerboard = [];
    for(let x=0; x<50; x++) {
      for (let y=0; y<50; y++) {
        if ((x+y) % 2 == 0) {
          checkerboard.push(room.getPositionAt(x, y));
        }
      }
    }

    // Place towers
    plan.towers = [];
    for (var i = utils.getTowersAtRCL(room.controller.level); i > 0;) {
      let newTower;
      while (!newTower) {
        newTower = plan.storage.findClosestByPath(checkerboard, {
          filter: pos => !pos.inRangeTo(plan.storage, 2) && pos.validPosition() && !pos.checkForStructures()
        });
        if (_.any(_.flatten(plan.roads), tile => tile.isEqualTo(newTower))) {
          _.pull(checkerboard, newTower);
          newTower = null;
        }
      }

      plan.towers.push(newTower);
      _.pull(checkerboard, newTower);
      i--;
    }

    // Place extensions
    plan.extensions = [];
    for (var i = utils.getExtensionsAtRCL(room.controller.level); i > 0;) {
      let newExt;

      while (!newExt) {
        newExt = plan.storage.findClosestByPath(checkerboard, {
          filter: pos => !pos.inRangeTo(plan.storage, 2) && pos.validPosition() && !pos.checkForStructures()
        });
        if (_.any(_.flatten(plan.roads), tile => tile.isEqualTo(newExt))) {
          _.pull(checkerboard, newExt);
          newExt = null;
        }
      }

      plan.extensions.push(newExt);
      _.pull(checkerboard, newExt);
      i--;
    }

    room.memory.plan = plan;
  }
}

hivemind.roadFromTo = (from, to, range = 1) => {
  return PathFinder.search(from, {
    pos: to,
    range: range
  }, {
    plainCost: 1,
    swampCost: 1,
    maxRooms: 1
  });
}

hivemind.buildRoads = () => {
  _.forEach(Game.rooms, roomInst => {
    if (roomInst.controller &&
      roomInst.controller.my &&
      roomInst.memory.constructionSites &&
      roomInst.memory.constructionSites.length < 1 &&
      roomInst.executeEveryTicks(200) &&
      roomInst.memory.plan) {
      _.forEach(roomInst.memory.plan.roads, road => {
        _.forEach(road, point => {
          roomInst.createConstructionSite(point.x, point.y, STRUCTURE_ROAD);
        });
      });
    }
  });
};

hivemind.buildStructures = () => {
_.forEach(Game.rooms, room => {
  if (room.controller && room.controller.my && room.executeEveryTicks(200) && room.memory.plan) {
    room.createConstructionSite(room.memory.plan.storage.x, room.memory.plan.storage.y, STRUCTURE_STORAGE);

    _.forEach(room.memory.plan.towers, tower => {
      room.createConstructionSite(tower.x, tower.y, STRUCTURE_TOWER);
    });

    _.forEach(room.memory.plan.extensions, extension => {
      room.createConstructionSite(extension.x, extension.y, STRUCTURE_EXTENSION);
    });

  }
});
}

hivemind.regenerateRoomPlans = () => {
_.map(Game.rooms, room => {
  room.memory.plan = {};
});
}

hivemind.cleanUpCreepMemory = () => {
for (let name in Memory.creeps) {
  if (!Game.creeps[name]) {
    delete Memory.creeps[name];
  }
}
}

hivemind.interpretFlags = () => {
_.forEach(Game.flags, flag => {
  switch (flag.color) {
    case COLOR_RED:
      if (flag.room == undefined || !flag.room.controller.my) {
        _.map(_.filter(Game.creeps, creep => {
          return creep.memory.role === 'scout'
        }), creep => {
          creep.memory.targetRoom = flag.pos.roomName
        });
      }
      flag.remove();
      break;
    case COLOR_BLUE:
      if (flag.room == undefined || !flag.room.controller.my) {
        _.map(_.filter(Game.creeps, creep => {
          return creep.memory.role === 'reserver'
        }), creep => {
          creep.memory.targetRoom = flag.pos.roomName
        });
      }
      break;
    case COLOR_YELLOW:
      if (flag.room == undefined || !flag.room.controller.my) {
        _.map(_.filter(Game.creeps, creep => {
          return creep.memory.role === 'remoteminer'
        }), creep => {
          creep.memory.targetRoom = flag.pos.roomName
        });
      }
      break;
    case COLOR_ORANGE:
      if (flag.room && flag.room.controller.my) {
        var spawns = flag.room.memory.structuresByType.spawn;
        _.forEach(spawns, spawn => {
          var road = hivemind.roadFromTo(spawn.pos, flag.pos);
          flag.room.memory.plan.roads.push(road.path);
        })
      }
      flag.remove();
      break;
    case COLOR_PURPLE:
       if (flag.room == undefined || !flag.room.controller.my) {
         let myRooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
         let sortedRooms = _.sortBy(myRooms, room => Game.map.getRoomLinearDistance(flag.pos.roomName, room.name));
         let closestRoom = _.head(sortedRooms);

         if (!_.any(Game.creeps, creep => creep.memory.role == 'reclaimer' && creep.memory.originRoom == closestRoom.name) &&
             !_.any(closestRoom.memory.spawnQueue, item => item.role == 'reclaimer' && item.memory.originRoom == closestRoom.name)) {
               closestRoom.memory.spawnQueue.push({role: 'reclaimer', memory: {originRoom: closestRoom.name}});
         }

         if (!Memory.claimRooms) {
           Memory.claimRooms = [];
         }

         if (!_.includes(Memory.claimRooms, flag.pos.roomName)) {
           Memory.claimRooms.push(flag.pos.roomName);
         }

         let creeps = _.map(closestRoom.memory.myCreeps, creep => Game.getObjectById(creep.id));
         let reclaimers = _.filter(creeps, creep => creep.memory.role == 'reclaimer' && !creep.memory.job);
         reclaimerJobs.assignJobs(closestRoom, reclaimers);
         break;
       }
  }

});
}

hivemind.manageNextRooms = () => {
  _.forEach(Game.rooms, room => {
    if(!room.memory.my) {
      return;
    } else if (!room.memory.structuresByType.spawn) {
      let myRooms = _.filter(Game.rooms, otherRoom => otherRoom.memory.my && otherRoom.name != room.name);
      let sortedRooms = _.sortBy(myRooms, otherRoom => Game.map.getRoomLinearDistance(room.name, otherRoom.name));
      let closestRoom = _.head(sortedRooms);

      let totalNextroomersAlreadySent =
      _.filter(Game.creeps, creep => creep.memory.role == 'nextroomer' && creep.memory.originRoom == closestRoom.name).length +
      _.filter(closestRoom.memory.spawnQueue, item => item.role == 'nextroomer' && item.memory.originRoom == closestRoom.name).length;

      if (totalNextroomersAlreadySent < 3) {
        closestRoom.memory.spawnQueue.push({role: 'nextroomer', memory: {originRoom: closestRoom.name, targetRoom: room.name}});
      }

      let creeps = _.map(closestRoom.memory.myCreeps, creep => Game.getObjectById(creep.id));
      let nextroomers = _.filter(creeps, creep => creep.memory.role == 'nextroomer' && !creep.memory.job && creep.memory.originRoom == closestRoom.name);
      nextroomerJobs.assignJobs(closestRoom, nextroomers);

      creeps = _.map(room.memory.myCreeps, creep => Game.getObjectById(creep.id));
      nextroomers = _.filter(creeps, creep => creep.memory.role == 'nextroomer' && !creep.memory.job);
      nextroomerJobs.assignJobs(room, nextroomers);

    }
  });
}

hivemind.isJobEqual = job1 => job2 => {
  if (!job1 || !job2) {
    return false;
  }

  return (job1.creepType == job2.creepType && job1.action == job2.action && job1.priority == job2.priority && job1.room == job2.room && job1.target == job2.target);
}

hivemind.assignJobs = () => {
  _.forEach(Game.rooms, room => {
    if (room.controller && room.controller.my) {
      let jobs = _.sortBy(room.memory.jobs, job => job.priority);
      let creeps = _.map(room.memory.myCreeps, creep => Game.getObjectById(creep.id));
      let builders = _.filter(creeps, creep => creep.memory.role == 'builder' && !creep.memory.job);
      let couriers = _.filter(creeps, creep => creep.memory.role == 'courier' && !creep.memory.job);
      let upgraders = _.filter(creeps, creep => creep.memory.role == 'upgrader' && !creep.memory.job);

      courierJobs.assignJobs(room, couriers);
      upgraderJobs.assignJobs(room, upgraders);
      builderJobs.assignJobs(room, builders);
    }
  });
}

hivemind.think = () => {
let profiler = {};
profiler.init = Game.cpu.getUsed();

// hivemind.buildRoads();
// profiler.buildRoads = Game.cpu.getUsed() - _.sum(profiler);
// hivemind.buildStructures();
// profiler.buildStructures = Game.cpu.getUsed() - _.sum(profiler);
hivemind.interpretFlags();
profiler.interpretFlags = Game.cpu.getUsed() - _.sum(profiler);
hivemind.cleanUpCreepMemory();
profiler.cleanUpCreepMemory = Game.cpu.getUsed() - _.sum(profiler);
hivemind.assignJobs();
profiler.assignJobs = Game.cpu.getUsed() - _.sum(profiler);
hivemind.manageNextRooms();

Memory.stats.hivemindProfiler = profiler;
}
