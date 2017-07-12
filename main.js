require('creeps.prototype');
require('rooms.prototype');
require('hivemind');
require('config');

const stats = require('screepsplus');

const bodies = require('creeps.bodies');
const roles = require('creeps.roles');
const spawnModule = require('spawn.main');
const roomModule = require('rooms.main');
const towerModule = require('towers.main');

module.exports.loop = function() {

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    for (var role in roles) {
      if (creep.memory.role == role) {
        roles[role].behavior.run(creep);
        creep.room.visual.text(role, creep.pos);
      }
    }
  }

  for (var spawn in Game.spawns) {
    spawnModule.spawnBehavior(Game.spawns[spawn]);
  }

  for (var room in Game.rooms) {
    roomModule.roomBehavior(Game.rooms[room]);

    if(Game.rooms[room].memory.plan && Game.rooms[room].memory.plan.roads) {
      for( var road in Game.rooms[room].memory.plan.roads) {
        Game.rooms[room].visual.poly(Game.rooms[room].memory.plan.roads[road], {stroke: '#FFFFFF', opacity: 0.5, strokeWidth: 0.1});
      }
    }

    if(Game.rooms[room].executeEveryTicks(25)) {
        _.map(_.filter(Game.creeps, creep => {return creep.memory.role==='remoteminer'}), creep => {creep.memory.targetRoom='E69N42'});
        _.map(_.filter(Game.creeps, creep => {return creep.memory.role==='reserver'}), creep => {creep.memory.targetRoom='E69N42'});
    }

  }

  towerModule.towerBehavior(_.filter(Game.structures, structure => {
    return (structure.structureType == STRUCTURE_TOWER);
  })[0]);


  hivemind.think();

  if (Game.rooms.E68N43.executeEveryTicks(25)) {
    stats.collectStats();
  }

}
