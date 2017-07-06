if (!Creep.prototype._moveTo) {
  Creep.prototype._moveTo = Creep.prototype.moveTo;

  Creep.prototype.moveTo = function(...args) {

    if(!args[0]) {
      this.say('ERROR: Invalid moveTo target.')
    }
    return this._moveTo.apply(this, args);
  }
}
