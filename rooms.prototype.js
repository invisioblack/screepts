Room.prototype.executeEveryTicks = function(ticks) {
  return (Game.time + this.controller.pos.x + this.controller.pos.y) % ticks === 0;
};
