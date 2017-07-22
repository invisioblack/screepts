require('creeps.prototype');
require('rooms.prototype');
require('roomPosition.prototype');
require('hivemind');
require('config');
require('utils');

const stats = require('screepsplus');

const bodies = require('creeps.bodies');
const roles = require('creeps.roles');
const spawnModule = require('spawn.main');
const roomModule = require('rooms.main');
const towerModule = require('towers.main');

module.exports.loop = function() {
  var profiler = {};
  profiler.init = Game.cpu.getUsed();

  stats.clearStats();

  var roleProfiler = {};

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    for (var role in roles) {
      if (!roleProfiler[role]) {
        roleProfiler[role] = 0;
      }
      var cpuBefore = Game.cpu.getUsed();

      if (creep.memory.role == role) {
        roles[role].behavior.run(creep);
        creep.room.visual.text(role, creep.pos);

        var cpuAfter = Game.cpu.getUsed();
        roleProfiler[role] += cpuAfter-cpuBefore;
      }
    }

  }

  profiler.creeps = Game.cpu.getUsed() - _.sum(profiler);

  _.forEach(Game.spawns, spawn => {
    spawnModule.spawnBehavior(spawn);
  });

  profiler.spawns = Game.cpu.getUsed() - _.sum(profiler);

  _.forEach(Game.rooms, room => {
    roomModule.initRoom(room);
    if (room.memory.my) {
      roomModule.roomBehavior(room);
    }

    hivemind.visualizePlans(room);
  });

  profiler.rooms = Game.cpu.getUsed() - _.sum(profiler);

  towerModule.towerBehavior(_.filter(Game.structures, structure => {
    return (structure.structureType == STRUCTURE_TOWER);
  })[0]);

  profiler.towers = Game.cpu.getUsed() - _.sum(profiler);

  hivemind.think();

  profiler.hivemind = Game.cpu.getUsed() - _.sum(profiler);

  stats.collectStats();

  Memory.stats['profiler.creeps'] = profiler.creeps;
  Memory.stats['profiler.spawns'] = profiler.spawns;
  Memory.stats['profiler.rooms'] = profiler.rooms;
  Memory.stats['profiler.towers'] = profiler.towers;
  Memory.stats['profiler.hivemind'] = profiler.hivemind;
  Memory.stats.roleProfiler = roleProfiler;
}
