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

hivemind.planRoom = () => {
  _.forEach(Game.rooms, roomInst => {

    if (roomInst.controller && roomInst.controller.my) {

      if (!roomInst.memory.plan) {
        roomInst.memory.plan = {};
      }

      roomInst.memory.plan.taken = [];

      if (!roomInst.memory.plan.dismantle) {
        roomInst.memory.plan.dismantle = [];
      }

      if (!roomInst.memory.plan.spawn) {
        roomInst.memory.plan.spawn = roomInst.controller.pos.findNearPosition().next().value
                                                            .findNearPosition().next().value
                                                            .findNearPosition().next().value
                                                            .findNearPosition().next().value;
      }

      if (!roomInst.memory.plan.storage) {
        roomInst.memory.plan.storage = roomInst.controller.pos.findNearPosition().next().value
                                                              .findNearPosition().next().value;
        roomInst.memory.plan.taken.push(roomInst.memory.plan.storage);
      }

      if (!roomInst.memory.plan.upgrader) {
        roomInst.memory.plan.upgrader = new RoomPosition(
          roomInst.memory.plan.storage.x,
          roomInst.memory.plan.storage.y,
          roomInst.memory.plan.storage.roomName
        ).findNearPosition().next().value;
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

        _.forEach(spawns, spawn => {
          var road;
          // Connect spawns to sources
          _.forEach(sources, source => {
            road = hivemind.roadFromTo(spawn.pos, source.pos);
            roads.push(road.path);
            roomInst.memory.plan.taken.push(...road.path);
          });

          // Connect spawns to room controller
          road = hivemind.roadFromTo(spawn.pos, roomInst.controller.pos);
          roads.push(road.path);
          roomInst.memory.plan.taken.push(...road.path);

          // Connect spawns to exits
          var exits = [spawn.pos.findClosestByPath(FIND_EXIT_TOP),
            spawn.pos.findClosestByPath(FIND_EXIT_BOTTOM),
            spawn.pos.findClosestByPath(FIND_EXIT_RIGHT),
            spawn.pos.findClosestByPath(FIND_EXIT_LEFT)];

        _.forEach(exits, exit => {
          if (exit) {
            road = hivemind.roadFromTo(spawn.pos, exit);
            roads.push(road.path);
            roomInst.memory.plan.taken.push(...road.path);
          }
        });
      });

      roomInst.memory.plan.roads = roads;

    }

    var longestRoad = _.last(_.sortBy(roomInst.memory.plan.roads, road => road.length));
    longestRoad = _.takeRight(longestRoad, longestRoad.length - 2);

    if (!roomInst.memory.plan.extensions) {
      roomInst.memory.plan.extensions = [];

      var freePositions = hivemind.getFreePositionsNear(longestRoad, roomInst);

      for (var i = 0; i < utils.getExtensionsAtRCL(roomInst.controller.level); i++) {
        roomInst.memory.plan.extensions.push(freePositions[i]);
        roomInst.memory.plan.taken.push(freePositions[i]);
      }
    }

    if (!roomInst.memory.plan.towers) {
      roomInst.memory.plan.towers = [];

      var freePositions = hivemind.getFreePositionsNear(longestRoad, roomInst);

      for (var i = 0; i < utils.getTowersAtRCL(roomInst.controller.level); i++) {
        roomInst.memory.plan.towers.push(freePositions[i]);
        roomInst.memory.plan.taken.push(freePositions[i]);
      }
    }

  }});
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
  if (roomInst.controller && roomInst.controller.my && roomInst.memory.constructionSites.length < 1 && roomInst.executeEveryTicks(200) && roomInst.memory.plan) {
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

hivemind.scheduleDismantling = (room, plannedList, structureType) => {
_.forEach(_.filter(room.memory.structures, {structureType: structureType}), structure => {
  if (!_.some(plannedList, plannedStruct => plannedStruct.x == structure.pos.x && plannedStruct.y == structure.pos.y) && !_.some(room.memory.plan.dismantle, toDismantle => toDismantle.x == structure.pos.x && toDismantle.y == structure.pos.y)) {
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
_forEach(Game.rooms, room => {});
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
        var spawns = _.filter(flag.room.memory.structures, { structureType: STRUCTURE_SPAWN });
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

hivemind.isJobEqual = job1 => job2 => {
if (!job1 || !job2) {
  return false;
}

return (job1.creepType == job2.creepType && job1.action == job2.action && job1.priority == job2.priority && job1.room == job2.room && job1.target == job2.target);
}

hivemind.createJobs = () => {

_.forEach(Game.rooms, room => {
  if (room.controller && room.controller.my) {
    room.memory.jobs = [];

    // Create building jobs
    _.forEach(room.memory.constructionSites, cs => {
      var priority = _.includes(Object.keys(priorities.CONSTRUCTION_PRIORITIES), cs.structureType)
        ? priorities.CONSTRUCTION_PRIORITIES[cs.structureType]
        : 100;
      var secondaryPriority = (cs.progressTotal - cs.progress) / cs.progressTotal;

      room.memory.jobs.push({
        creepType: 'builder',
        action: 'build',
        priority: priority,
        secondaryPriority: secondaryPriority,
        room: cs.pos.roomName,
        target: cs.id
      });
    });

    // Create energy collection jobs
    _.forEach(room.memory.droppedEnergy, dropped => {

      for (var i=0; i<1+Math.floor(dropped.amount/300); i++) {
        room.memory.jobs.push({
          creepType: 'courier',
          action: 'collectEnergy',
          priority: 1,
          secondaryPriority: 1,
          room: dropped.pos.roomName,
          target: dropped.id
        });
      }

    });

    // Create energy withdrawal jobs
    var containers = room.memory.structuresByType.container;
    _.forEach(containers, container => {
      let realContainer = Game.getObjectById(container.id);
      for (var i=0; i<Math.floor(realContainer.store[RESOURCE_ENERGY]/300); i++) {
        room.memory.jobs.push({
          creepType: 'courier',
          action: 'withdrawEnergy',
          priority: 2,
          secondaryPriority: 1,
          room: container.pos.roomName,
          target: container.id
        });
      }
    });

    // Create energy withdrawal jobs for upgraders
    for (var i=0; i<Math.floor(room.storage.store[RESOURCE_ENERGY]/300; i++)) {
      
    }

    let creeps = room.memory.myCreeps;

    _.forEach(creeps, creep => {
      _.remove(room.memory.jobs, hivemind.isJobEqual(creep.memory.job))
    });

  }
});

}

hivemind.assignJobs = () => {
  _.forEach(Game.rooms, room => {
    if (room.controller && room.controller.my) {
      let jobs = _.sortBy(room.memory.jobs, job => job.priority);
      let creeps = room.memory.myCreeps;
      let builders = _.filter(creeps, creep => creep.memory.role=='builder');
      let couriers = _.filter(creeps, creep => creep.memory.role=='courier');

      _.forEach(jobs, job => {
        switch (job.creepType) {
          case 'builder':
            if (builders.length < 1)
              return;
            _.head(builders).memory.job = job;
            builders = _.tail(builders);
            break;
          case 'courier':
            if (couriers.length < 1)
              return;
            _.head(couriers).memory.job = job;
            couriers = _.tail(couriers);
            break;
        }
      });

    }
  });
}

hivemind.think = () => {
let profiler = {};
profiler.init = Game.cpu.getUsed();

hivemind.planRoom();
profiler.planRooms = Game.cpu.getUsed() - _.sum(profiler);
hivemind.buildRoads();
profiler.buildRoads = Game.cpu.getUsed() - _.sum(profiler);
hivemind.buildStructures();
profiler.buildStructures = Game.cpu.getUsed() - _.sum(profiler);
hivemind.interpretFlags();
profiler.interpretFlags = Game.cpu.getUsed() - _.sum(profiler);
hivemind.cleanUpCreepMemory();
profiler.cleanUpCreepMemory = Game.cpu.getUsed() - _.sum(profiler);
hivemind.scheduleDeconstructions();
profiler.scheduleDeconstructions = Game.cpu.getUsed() - _.sum(profiler);
hivemind.createJobs();
profiler.createJobs = Game.cpu.getUsed() - _.sum(profiler);
hivemind.assignJobs();
profiler.assignJobs = Game.cpu.getUsed() - _.sum(profiler);

Memory.stats.hivemindProfiler = profiler;
}
