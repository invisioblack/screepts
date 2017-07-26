function calculateBodyCost(body) {
  return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
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

function getTowersAtRCL(rcl) {
  switch (rcl) {
    case 3:
    case 4:
      return 1;
    case 5:
    case 6:
      return 2;
    case 7:
      return 3;
    case 8:
      return 6;
    default:
      return 0;
  }
}

function getLabsAtRCL(rcl) {
  switch(rcl) {
    case 6:
      return 3;
    case 7:
      return 6;
    case 8:
      return 10;
    default:
      return 0;
  }
}

module.exports = {
  calculateBodyCost,
  getExtensionsAtRCL,
  getTowersAtRCL,
  getLabsAtRCL
}
