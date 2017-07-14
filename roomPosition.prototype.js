RoomPosition.prototype.findNearPosition = function() {
  let distanceMax = 1;
  for (let distance = 1; distance <= distanceMax; distance++) {
    for (let direction = 1; direction <= 8 * distance; direction++) {
      let posNew = this.buildRoomPosition(direction, distance);
      if (!posNew.validPosition()) {
        continue;
      }
      yield posNew;
    }
  }
};

RoomPosition.prototype.buildRoomPosition = function(direction, distance) {
  return this.getAdjacentPosition((direction - 1) % 8 + 1);
};

RoomPosition.prototype.validPosition = function() {
  if (this.isBorder()) {
    return false;
  }
  if (this.checkForWall()) {
    return false;
  }
  if (this.inPath()) {
    return false;
  }
  return true;
};

RoomPosition.prototype.isBorder = function(offset) {
  offset = offset || 0;
  if (this.x <= 1 + offset || this.x >= 48 - offset || this.y <= 1 + offset || this.y >= 48 - offset) {
    return true;
  }
  return false;
};

RoomPosition.prototype.checkForWall = function() {
  return this.lookFor(LOOK_TERRAIN)[0] === 'wall';
};

RoomPosition.prototype.getRoom = function() {
  const room = Game.rooms[this.roomName];
  if (!room) {
    throw new Error(`Could not access room ${this.roomName}`);
  }
  return room;
};
