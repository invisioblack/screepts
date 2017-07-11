hivemind = {};

hivemind.planRoads = () => {
  for (var room in Game.rooms) {
    var roomInst = Game.rooms[room];

    if (roomInst.controller.my) {
      if (!roomInst.memory.plan || !roomInst.memory.plan.roads) {

        if (!roomInst.memory.plan) {
          roomInst.memory.plan = {};
        }
        var roads = [];

        // Connect spawns
        var spawns = roomInst.find(FIND_MY_SPAWNS);
        for (var spawn in spawns) {

          var road;

          // Connect spawns to sources
          var sources = roomInst.find(FIND_SOURCES);
          for (var source in sources) {
            var road = PathFinder.search(spawns[spawn].pos, {pos: sources[source].pos, range: 1}, {plainCost: 1, swampCost: 1});
            roads.push(road.path);
          }

          // Connect spawns to room controller
          road = PathFinder.search(spawns[spawn].pos, {pos: roomInst.controller.pos, range: 1}, {plainCost: 1, swampCost: 1});
          roads.push(road.path);

          // Connect spawns to exits
          var exits = [
            spawns[spawn].pos.findClosestByPath(FIND_EXIT_TOP),
            spawns[spawn].pos.findClosestByPath(FIND_EXIT_BOTTOM),
            spawns[spawn].pos.findClosestByPath(FIND_EXIT_RIGHT),
            spawns[spawn].pos.findClosestByPath(FIND_EXIT_LEFT)
          ];

          for (var exit in exits) {
            if (exits[exit]) {
              road = PathFinder.search(spawns[spawn].pos, exits[exit], {maxRooms: 1, plainCost: 1, swampCost: 1});
              roads.push(road.path);
            }
          }

        }

        roomInst.memory.plan.roads = roads;

      }
    }
  }
}

hivemind.restoreRoads = () => {
  for (var room in Game.rooms) {
    var roomInst = Game.rooms[room];
    if (roomInst.executeEveryTicks(200)) {
      _.map(roomInst.memory.plan.roads, road => {
        _.map(road, point => {
          roomInst.createConstructionSite(point, STRUCTURE_ROAD);
        });
      });
    }
  }
};

hivemind.think = () => {
  hivemind.planRoads();
  hivemind.restoreRoads();
}
