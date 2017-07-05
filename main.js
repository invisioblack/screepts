const bodies = require('creeps.bodies');
const roles = require('creeps.roles');
const spawn = require('spawn.main');

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

  spawn.spawnBehavior();
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
