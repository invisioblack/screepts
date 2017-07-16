if (!Creep.prototype._moveTo) {
  Creep.prototype._moveTo = Creep.prototype.moveTo;

  Creep.prototype.moveTo = function(...args) {

    return this._moveTo.apply(this, args);
  }
}
