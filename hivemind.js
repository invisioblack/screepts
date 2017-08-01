const utils = require('utils');

const actions = require('jobs.actions');
const priorities = require('jobs.priorities');

const builderJobs = require('jobs.builder');
const courierJobs = require('jobs.courier');
const upgraderJobs = require('jobs.upgrader');
const reclaimerJobs = require('jobs.reclaimer');
const nextroomerJobs = require('jobs.nextroomer');
const excavatorJobs = require('jobs.excavator');
const remoteminerJobs = require('jobs.remoteminer');

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

  if (room.memory.plan && room.memory.plan.towers) {
    _.forEach(room.memory.plan.towers, tower => {
      if (tower) {
        room.visual.text('T', tower);
      }
    });
  }

  if (room.memory.plan && room.memory.plan.important) {
    _.forEach(room.memory.plan.important, struct => {
      if (struct) {
        room.visual.text('O', struct);
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

    // Place important structures
    let totalStructures = utils.getTowersAtRCL(8) +
                          utils.getExtensionsAtRCL(8) +
                          utils.getLabsAtRCL(8) +
                          3; // Nuker, observer, terminal
    plan.important = [];
    var flattened = _.flatten(plan.roads);
    checkerboard = _.filter(checkerboard, ch => !_.find(flattened, tile => tile.isEqualTo(ch)));
    for (var i=totalStructures; i > 0;) {
      let struct;
      while (!struct) {
        struct = plan.storage.findClosestByPath(checkerboard, {
          filter: pos => !pos.inRangeTo(plan.storage, 2) &&
                          pos.validPosition() &&
                         !pos.checkForWall() &&
                         !pos.checkForConstructedWall()
        });
      }

      plan.important.push(struct);
      _.pull(checkerboard, struct);
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

hivemind.buildRoads = room => {
  let cs = Object.keys(Game.constructionSites).length;
  let roadCS = 0;
  let roads = _.flatten(room.memory.plan.roads);
  let roadTile = _.head(roads);
  while (cs + roadCS < 100 && roadTile) {
    roadTile = room.getPositionAt(roadTile.x, roadTile.y);
    roads = _.tail(roads);
    if (!roadTile.checkForConstructionSites() && !roadTile.checkForRoads()) {
      room.createConstructionSite(roadTile, STRUCTURE_ROAD);
      roadCS++;
    }
    roadTile = _.head(roads);
  }
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
        // Flagged as a room to be mined by remote miners
        if (!Memory.remoteMineRooms) {
          Memory.remoteMineRooms = [];
        }

        if (!_.includes(Memory.remoteMineRooms, flag.pos.roomName)) {
          Memory.remoteMineRooms.push(flag.pos.roomName);
        } else {
          _.remove(Memory.remoteMineRooms, r => r==flag.pos.roomName);
        }
      }
      flag.remove();
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
         let closestRoom = hivemind.getMyClosestRoom(flag.pos.roomName);

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

hivemind.getMyClosestRoom = roomName => {
  let myRooms = _.filter(Game.rooms, room => room.controller && room.controller.my);
  let sortedRooms = _.sortBy(myRooms, room => Game.map.getRoomLinearDistance(roomName, room.name));
  let closestRoom = _.head(sortedRooms);
  return closestRoom;
}

hivemind.manageNextRooms = () => {
  _.forEach(Game.rooms, room => {
    if(!room.memory.my) {
      return;
    } else if (!room.memory.structuresByType.spawn) {
      let closestRoom = hivemind.getMyClosestRoom(room.name);

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

hivemind.manageRemoteMiners = () => {
  if (!Memory.remoteMineRooms) {
    return;
  }

  _.forEach(Memory.remoteMineRooms, name => {
    let room = Game.rooms[name];

    if (room) {
      let remoteminers = _(room.find(FIND_MY_CREEPS))
                      .filter(c => c.memory.role == 'remoteminer' && !c.memory.job)
                      .value();
      remoteminerJobs.assignJobs(room, remoteminers);
    }

    if (room && room.memory && room.memory.my) {
      return;
    }

    let closestRoom = hivemind.getMyClosestRoom(name);
    let totalMinersAlreadySent = _.filter(Game.creeps, creep => creep.memory.role == 'remoteminer' && creep.memory.originRoom == closestRoom.name).length +
    _.filter(closestRoom.memory.spawnQueue, item => item.role == 'remoteminer' && item.memory.originRoom == closestRoom.name).length;

    if (totalMinersAlreadySent < 3) {
      closestRoom.memory.spawnQueue.push({role:'remoteminer', memory: {originRoom: closestRoom.name, targetRoom: name}});
    }

    let remoteminers = _(closestRoom.memory.myCreeps)
                        .map(c => Game.getObjectById(c.id))
                        .filter(c => c.memory.role == 'remoteminer' && !c.memory.job && c.memory.originRoom == closestRoom.name)
                        .value();
    remoteminerJobs.assignJobs(closestRoom, remoteminers);

  });
}

hivemind.assignJobs = () => {
  _.forEach(Game.rooms, room => {
    if (room.controller && room.controller.my) {
      let jobs = _.sortBy(room.memory.jobs, job => job.priority);
      let creeps = _.map(room.memory.myCreeps, creep => Game.getObjectById(creep.id));
      let builders = _.filter(creeps, creep => creep.memory.role == 'builder' && !creep.memory.job);
      let couriers = _.filter(creeps, creep => creep.memory.role == 'courier' && !creep.memory.job);
      let upgraders = _.filter(creeps, creep => creep.memory.role == 'upgrader' && !creep.memory.job);
      let excavators = _.filter(creeps, creep => creep.memory.role == 'excavator' && !creep.memory.job);

      courierJobs.assignJobs(room, couriers);
      upgraderJobs.assignJobs(room, upgraders);
      builderJobs.assignJobs(room, builders);
      excavatorJobs.assignJobs(room, excavators);
    }
  });
}

hivemind.think = () => {
let profiler = {};
profiler.init = Game.cpu.getUsed();

hivemind.interpretFlags();
profiler.interpretFlags = Game.cpu.getUsed() - _.sum(profiler);
hivemind.cleanUpCreepMemory();
profiler.cleanUpCreepMemory = Game.cpu.getUsed() - _.sum(profiler);
hivemind.assignJobs();
profiler.assignJobs = Game.cpu.getUsed() - _.sum(profiler);
hivemind.manageNextRooms();
profiler.manageNextRooms = Game.cpu.getUsed() - _.sum(profiler);
hivemind.manageRemoteMiners();
profiler.manageRemoteMiners = Game.cpu.getUsed() - _.sum(profiler);

Memory.stats.hivemindProfiler = profiler;
}
