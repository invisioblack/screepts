require('creeps.prototype');
require('rooms.prototype');
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

  stats.clearStats();

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    for (var role in roles) {
      if (creep.memory.role == role) {
        roles[role].behavior.run(creep);
        creep.room.visual.text(role, creep.pos);
      }
    }
  }

  _.forEach(Game.spawns, spawn => {
    spawnModule.spawnBehavior(spawn);
  })

  _.forEach(Game.rooms, room => {
    roomModule.initRoom(room);
    if (room.memory.my) {
      roomModule.roomBehavior(room);
    }

    if (room.memory.plan && room.memory.plan.roads) {
      for (var road in room.memory.plan.roads) {
        room.visual.poly(room.memory.plan.roads[road], {
          stroke: '#FFFFFF',
          opacity: 0.5,
          strokeWidth: 0.1
        });
      }
    }
  })

  towerModule.towerBehavior(_.filter(Game.structures, structure => {
    return (structure.structureType == STRUCTURE_TOWER);
  })[0]);

  hivemind.think();

  stats.collectStats();

}
