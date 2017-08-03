if (!Creep.prototype._moveTo) {
  Creep.prototype._moveTo = Creep.prototype.moveTo;

  Creep.prototype.moveTo = function(...args) {

    if(!this.room.memory.heatmap) {
      this.room.memory.heatmap = {};
    }

    if (!this.room.memory.heatmap[this.pos.x]) {
      this.room.memory.heatmap[this.pos.x] = {};
    }

    if (!this.room.memory.heatmap[this.pos.x][this.pos.y]) {
      this.room.memory.heatmap[this.pos.x][this.pos.y] = 1;
    } else {
      this.room.memory.heatmap[this.pos.x][this.pos.y] += 1;
      
      if (this.room.memory.my && this.fatigue > 0 && this.room.memory.heatmap[this.pos.x][this.pos.y] > 15) {
        this.room.createConstructionSite(this.pos.x, this.pos.y, STRUCTURE_ROAD);
      }
    }

    return this._moveTo.apply(this, args);
  }
}
