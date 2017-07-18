const utils = require('utils');

const actions = require('jobs.actions');
const priorities = require('jobs.priorities');

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

  if (room.memory.plan && room.memory.plan.storage) {
    room.visual.text('S', room.memory.plan.storage);
  }

  if (room.memory.plan && room.memory.plan.upgrader) {
    room.visual.text('U', room.memory.plan.upgrader);
  }

  if (room.memory.plan && room.memory.plan.tower) {
    room.visual.text('T', room.memory.plan.tower);
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

hivemind.planRoom = () => {
  _.forEach(Game.rooms, roomInst => {

    if (roomInst.controller && roomInst.controller.my) {

      if (!roomInst.memory.plan) {
        roomInst.memory.plan = {};
      }

      if (!roomInst.memory.plan.dismantle) {
        roomInst.memory.plan.dismantle = [];
      }

      if (!roomInst.memory.plan.taken) {
        roomInst.memory.plan.taken = [];
      }

      if (!roomInst.memory.plan.storage) {
        roomInst.memory.plan.storage = roomInst.controller.pos.findNearPosition().next().value;
        roomInst.memory.plan.taken.push(roomInst.memory.plan.storage);
      }

      if (!roomInst.memory.plan.upgrader) {
        roomInst.memory.plan.upgrader = new RoomPosition(roomInst.memory.plan.storage.x, roomInst.memory.plan.storage.y, roomInst.memory.plan.storage.roomName).findNearPosition().next().value;
        roomInst.memory.plan.taken.push(roomInst.memory.plan.upgrader);
      }

      if (!roomInst.memory.plan.roads) {
        var roads = [];

        // Connect spawns
        var spawns = roomInst.find(FIND_MY_SPAWNS);
        var sources = roomInst.find(FIND_SOURCES);
        var extensions = roomInst.find(FIND_MY_STRUCTURES, {
          filter: {
            structureType: STRUCTURE_EXTENSION
          }
        });

        for (var spawn in spawns) {

          var road;
          // Connect spawns to sources

          _.forEach(sources, source => {
            road = hivemind.roadFromTo(spawns[spawn].pos, source.pos);
            roads.push(road.path);
            roomInst.memory.plan.taken.push(...road.path);
          });

          // Connect spawns to room controller
          road = hivemind.roadFromTo(spawns[spawn].pos, roomInst.controller.pos);
          roads.push(road.path);
          roomInst.memory.plan.taken.push(...road.path);

          // Connect spawns to exits
          var exits = [spawns[spawn].pos.findClosestByPath(FIND_EXIT_TOP), spawns[spawn].pos.findClosestByPath(FIND_EXIT_BOTTOM), spawns[spawn].pos.findClosestByPath(FIND_EXIT_RIGHT), spawns[spawn].pos.findClosestByPath(FIND_EXIT_LEFT)];

          _.forEach(exits, exit => {
            if (exit) {
              road = hivemind.roadFromTo(spawns[spawn].pos, exit);
              roads.push(road.path);
              roomInst.memory.plan.taken.push(...road.path);
            }
          });
        }

        roomInst.memory.plan.roads = roads;

      }

      var longestRoad = _.last(_.sortBy(roomInst.memory.plan.roads, road => road.length));
      longestRoad = _.takeRight(longestRoad, longestRoad.length-2);

      if (!roomInst.memory.plan.extensions) {
        roomInst.memory.plan.extensions = [];

        var freePositions = hivemind.getFreePositionsNear(longestRoad, roomInst);

        for (var i = 0; i < utils.getExtensionsAtRCL(roomInst.controller.level); i++) {
          roomInst.memory.plan.extensions.push(freePositions[i]);
          roomInst.memory.plan.taken.push(freePositions[i]);
        }
      }

      if (!roomInst.memory.plan.tower) {
        var freePositions = hivemind.getFreePositionsNear(longestRoad, roomInst);
        roomInst.memory.plan.tower = freePositions[0];
        roomInst.memory.plan.taken.push(freePositions[0]);
      }

    }
  });
}

hivemind.getFreePositionsNear = (road, room) => {
  var freePositions = _.flatten(_.map(road, rp => {
    return Array.from(new RoomPosition(rp.x, rp.y, rp.roomName).findNearPosition())
  }));

  // Remove duplicate positions and taken positions
  var cleaned = [];
  freePositions = _.forEach(freePositions, position => {
    if (!_.some(cleaned, dupe => dupe.x == position.x && dupe.y == position.y) && !_.some(room.memory.plan.taken, dupe => dupe.x == position.x && dupe.y == position.y)) {
      cleaned.push(position);
    }
  });

  return cleaned;
}

hivemind.roadFromTo = (from, to) => {
  return PathFinder.search(from, {
    pos: to,
    range: 1
  }, {
    plainCost: 1,
    swampCost: 1,
    maxRooms: 1
  });
}

hivemind.buildRoads = () => {
  _.forEach(Game.rooms, roomInst => {
    if (roomInst.controller && roomInst.controller.my && roomInst.executeEveryTicks(200) && roomInst.memory.plan) {
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
      room.createConstructionSite(room.memory.plan.tower.x, room.memory.plan.tower.y, STRUCTURE_TOWER);

      _.forEach(room.memory.plan.extensions, extension => {
        room.createConstructionSite(extension.x, extension.y, STRUCTURE_EXTENSION);
      });


    }
  });
}

hivemind.scheduleDismantling = (room, plannedList, structureType) => {
  _.forEach(room.find(FIND_STRUCTURES, {filter: {structureType: structureType}}), structure => {
    if (!_.some(plannedList, plannedStruct => plannedStruct.x == structure.pos.x && plannedStruct.y == structure.pos.y) &&
        !_.some(room.memory.plan.dismantle, toDismantle => toDismantle.x == structure.pos.x && toDismantle.y == structure.pos.y)) {
          room.memory.plan.dismantle.push(structure.pos);
    }
  });
}

hivemind.scheduleDeconstructions = () => {
  _.forEach(Game.rooms, room => {
    if (room.controller && room.controller.my && room.executeEveryTicks(200) && room.memory.plan) {
      hivemind.scheduleDismantling(room, room.memory.plan.extensions, STRUCTURE_EXTENSION);
      hivemind.scheduleDismantling(room, _.flatten(room.memory.plan.roads), STRUCTURE_ROAD);
    }
  });
}

hivemind.cleanUpDeconstructions = () => {
  var newDeconstructions = [];
  _forEach(Game.rooms, room => {

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
          var spawns = flag.room.find(FIND_STRUCTURES, {
            filter: {
              structureType: STRUCTURE_SPAWN
            }
          });
          _.forEach(spawns, spawn => {
            var road = hivemind.roadFromTo(spawn.pos, flag.pos);
            flag.room.memory.plan.roads.push(road.path);
          })
        }
        flag.remove();
        break;
    }

  });
}

hivemind.createJobs = () => {
  Memory.jobs = [];

  _.forEach(Game.constructionSites, cs => {
    var priority = cs.structureType in priorities.CONSTRUCTION_PRIORITIES ? priorities.CONSTRUCTION_PRIORITIES[cs.structureType] : 100;
    var secondaryPriority = (cs.progressTotal-cs.progress)/cs.progressTotal;

    Memory.jobs.push({
      creepType: 'worker',
      action: 'build',
      priority: priority,
      secondaryPriority: secondaryPriority,
      room: cs.pos.roomName,
      target: cs.id
    });
  });
}

hivemind.assignJobs = () => {
  let jobs = _.sortBy(Memory.jobs, job => job.priority);
  _.forEach(jobs, job => {
    var target = Game.getObjectById(job.target);
    if (target) {
      var worker = target.pos.findClosestByPath(FIND_MY_CREEPS, {filter: creep => creep.memory.role=='builder'});
      if (worker) {
        worker.memory.job = job;
      }
    }
  });
}

hivemind.think = () => {
  hivemind.planRoom();
  hivemind.buildRoads();
  hivemind.buildStructures();
  hivemind.interpretFlags();
  hivemind.cleanUpCreepMemory();
  hivemind.scheduleDeconstructions();
  hivemind.createJobs();
  hivemind.assignJobs();
}
