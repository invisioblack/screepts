function calculateBodyCost(body) {
  return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
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
