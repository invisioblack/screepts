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

module.exports = {
  calculateBodyCost
}
