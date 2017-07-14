const utils = require ('utils');

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
};

hivemind.planRoom = () => {
  _.forEach(Game.rooms, roomInst => {

    if (roomInst.controller && roomInst.controller.my) {

      if (!roomInst.memory.plan) {
        roomInst.memory.plan = {};
      }

      if (!roomInst.memory.plan.storage) {
        roomInst.memory.plan.storage = roomInst.controller.pos.findNearPosition().next().value;
      }

      if (!roomInst.memory.plan.upgrader) {
        roomInst.memory.plan.upgrader = roomInst.memory.plan.storage.findNearPosition().next().value;
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
            var road = PathFinder.search(spawns[spawn].pos, {
              pos: sources[source].pos,
              range: 1
            }, {
              plainCost: 1,
              swampCost: 1
            });
            roads.push(road.path);
          }

          // Connect spawns to room controller
          road = PathFinder.search(spawns[spawn].pos, {
            pos: roomInst.controller.pos,
            range: 1
          }, {
            plainCost: 1,
            swampCost: 1
          });
          roads.push(road.path);

          // Connect spawns to exits
          var exits = [spawns[spawn].pos.findClosestByPath(FIND_EXIT_TOP), spawns[spawn].pos.findClosestByPath(FIND_EXIT_BOTTOM), spawns[spawn].pos.findClosestByPath(FIND_EXIT_RIGHT), spawns[spawn].pos.findClosestByPath(FIND_EXIT_LEFT)];

          for (var exit in exits) {
            if (exits[exit]) {
              road = PathFinder.search(spawns[spawn].pos, exits[exit], {
                maxRooms: 1,
                plainCost: 1,
                swampCost: 1
              });
              roads.push(road.path);
            }
          }
        }

        roomInst.memory.plan.roads = roads;

      }
    }
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
        if (!flag.room || !flag.room.controller.my) {
          _.map(_.filter(Game.creeps, creep => {
            return creep.memory.role === 'scout'
          }), creep => {
            creep.memory.targetRoom = flag.pos.roomName
          });
        }
        flag.remove();
        break;
      case COLOR_BLUE:
        if (!flag.room || !flag.room.controller.my) {
          _.map(_.filter(Game.creeps, creep => {
            return creep.memory.role === 'reserver'
          }), creep => {
            creep.memory.targetRoom = flag.pos.roomName
          });
        }
        break;
      case COLOR_YELLOW:
        if (!flag.room || !flag.room.controller.my) {
          _.map(_.filter(Game.creeps, creep => {
            return creep.memory.role === 'remoteminer'
          }), creep => {
            creep.memory.targetRoom = flag.pos.roomName
          });
        }
        break;
    }


  });
}

hivemind.think = () => {
  hivemind.planRoom();
  hivemind.restoreRoads();
  hivemind.interpretFlags();
}
