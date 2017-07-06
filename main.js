require('creeps.prototype');

const bodies = require('creeps.bodies');
const roles = require('creeps.roles');
const spawnModule = require('spawn.main');
const roomModule = require('room.main');

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

  for(var spawn in Game.spawns){
    spawnModule.spawnBehavior(Game.spawns[spawn]);
  }


  for(var room in Game.rooms){
    roomModule.roomBehavior(Game.rooms[room]);
  }

}
