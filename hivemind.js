hivemind = {};

hivemind.planRoads = () => {
  for(var room in Game.rooms) {
    var roomInst = Game.rooms[room];

    if (roomInst.controller.my) {
      if (!roomInst.memory.plan || !roomInst.memory.plan.roads) {

        if (!roomInst.memory.plan) {
          roomInst.memory.plan = {};
        }
        var roads = [];

        //Connect spawns to sources
        var spawns = room.find(FIND_MY_SPAWNS);
        for (var spawn in spawns) {
          var sources = room.find(FIND_SOURCES);
          for (var source in sources) {
            var road = PathFinder.search(spawns[spawn].pos, sources[source].pos);
            if (!road.incomplete) {
              roads.push(road.path);
            }
          }
        }

        roads = _.flatten(roads);

        roomInst.memory.plan.roads = roads;


      }
    }
  }
}
