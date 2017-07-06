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

if (!Creep.prototype._moveTo) {
  Creep.prototype._moveTo = Creep.prototype.moveTo;

  Creep.prototype.moveTo = function(...args) {

    if(!args[0]) {
      this.say('ERROR: Invalid moveTo target.')
    }
    return this._moveTo.apply(this, args);
  }
}
