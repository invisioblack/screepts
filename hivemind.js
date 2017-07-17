const utils = require('utils');

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

  if (room.memory.plan && room.memory.plan.extensions) {
    _.forEach(room.memory.plan.extensions, extension => {
      if (extension) {
        room.visual.text('E', extension);
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

          for (var source in sources) {
            road = hivemind.roadFromTo(spawns[spawn].pos, sources[source].pos);
            roads.push(road.path);
            roomInst.memory.plan.taken.push(...road.path);
          }

          // Connect spawns to room controller
          road = hivemind.roadFromTo(spawns[spawn].pos, roomInst.controller.pos);
          roads.push(road.path);
          roomInst.memory.plan.taken.push(...road.path);

          // Connect spawns to exits
          var exits = [spawns[spawn].pos.findClosestByPath(FIND_EXIT_TOP), spawns[spawn].pos.findClosestByPath(FIND_EXIT_BOTTOM), spawns[spawn].pos.findClosestByPath(FIND_EXIT_RIGHT), spawns[spawn].pos.findClosestByPath(FIND_EXIT_LEFT)];

          for (var exit in exits) {
            if (exits[exit]) {
              road = hivemind.roadFromTo(spawns[spawn].pos, exits[exit]);
              roads.push(road.path);
              roomInst.memory.plan.taken.push(...road.path);
            }
          }
        }

        roomInst.memory.plan.roads = roads;

      }

      if (!roomInst.memory.plan.extensions) {
        roomInst.memory.plan.extensions = [];
        var longestRoad = _.last(_.sortBy(roomInst.memory.plan.roads, road => road.length));
        var freePositions = _.flatten(_.map(longestRoad, rp => {
          return Array.from(rp.findNearPosition())
        }));

        // Remove duplicate positions and taken positions
        var cleaned = [];
        freePositions = _.forEach(freePositions, position => {
          if (!_.some(cleaned, dupe => dupe.x == position.x && dupe.y == position.y) && !_.some(roomInst.memory.plan.taken, dupe => dupe.x == position.x && dupe.y == position.y)) {
            cleaned.push(position);
            roomInst.memory.plan.taken.push(position);
          }
        });
        freePositions = cleaned;

        for (var i = 0; i < utils.getExtensionsAtRCL(roomInst.controller.level); i++) {
          roomInst.memory.plan.extensions.push(freePositions[i]);
        }
      }

    }
  });
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

hivemind.restoreRoads = () => {
  _.forEach(Game.rooms, roomInst => {

    if (roomInst.controller && roomInst.controller.my && roomInst.executeEveryTicks(200) && roomInst.memory.plan) {
      _.map(roomInst.memory.plan.roads, road => {
        _.map(road, point => {
          roomInst.createConstructionSite(point.x, point.y, STRUCTURE_ROAD);
        });
      });
    }
  });
};

hivemind.regenerateRoomPlans = () => {
  _.map(Game.rooms, room => {
    room.memory.plan = {};
  });
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

hivemind.think = () => {
  hivemind.planRoom();
  hivemind.restoreRoads();
  hivemind.interpretFlags();
}
