function calculateBodyCost(body) {
  return _.sum(_.map(body, part => {
    switch (part) {
      case MOVE:
      case CARRY:
        return 50;
      case WORK:
        return 100;
      case ATTACK:
        return 80;
      case RANGED_ATTACK:
        return 150;
      case HEAL:
        return 250;
      case CLAIM:
        return 600;
      case TOUGH:
        return 10;
    }
  }));
}

function freeSpaces(roomPosition) {
  let freeSpaceCount = 0;
  [
    roomPosition.x - 1,
    roomPosition.x,
    roomPosition.x + 1
  ].forEach(x => {
    [
      roomPosition.y - 1,
      roomPosition.y,
      roomPosition.y + 1
    ].forEach(y => {
      if (Game.map.getTerrainAt(x, y, roomPosition.roomName) != 'wall') {
        freeSpaceCount++;
      }
    });
  });

  return freeSpaceCount;
}

function getExtensionsAtRCL(rcl) {
  switch (rcl) {
    case 1:
      return 0;
    case 2:
      return 5;
    default:
      return (rcl - 2) * 10;
  }
}

module.exports = {
  calculateBodyCost,
  freeSpaces
}
