RoomPosition.prototype.findNearPosition = function*() {
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
  if (this.checkForStructures()) {
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

RoomPosition.prototype.checkForStructures = function() {
  return this.lookFor(LOOK_STRUCTURES).length > 0;
};

RoomPosition.prototype.getRoom = function() {
  const room = Game.rooms[this.roomName];
  if (!room) {
    throw new Error(`Could not access room ${this.roomName}`);
  }
  return room;
};

RoomPosition.prototype.getAdjacentPosition = function(direction) {
  var adjacentPos = [
    [0, 0],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
  ];
  return new RoomPosition(this.x + adjacentPos[direction][0], this.y + adjacentPos[direction][1], this.roomName);
};
