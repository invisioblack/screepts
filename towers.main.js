module.exports = {
  towerBehavior: (tower) => {

    var attacker = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    var wounded = tower.pos.findClosestByPath(FIND_MY_CREEPS, {
      filter: creep => {
        return creep.hits < creep.hitsMax;
      }
    });
    var damaged = tower.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        return structure.hits < structure.hitsMax;
      }
    });

    if (attacker) {
      tower.attack(attacker);
    } else if (wounded) {
      tower.heal(wounded);
    } else if (damaged) {
      tower.heal(damaged);
    }

  }
};
