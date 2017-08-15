module.exports = {
  towerBehavior: (tower) => {

    var attacker = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    var wounded = tower.pos.findClosestByPath(FIND_MY_CREEPS, {
      filter: creep => {
        return creep.hits < creep.hitsMax;
      }
    });

    var toBuild = _.union(global.Cache.rooms[tower.room.name].structuresByType.constructedWall, global.Cache.rooms[tower.room.name].structuresByType.rampart);
    toBuild = _.filter(toBuild, s => s.hits/s.hitsMax < 0.0025);
    toBuild = _.map(toBuild, s => Game.getObjectById(s.id));
    toBuild = _.sortBy(toBuild, s => s.hits/s.hitsMax);

    if (attacker) {
      tower.attack(attacker);
    } else if (wounded) {
      tower.heal(wounded);
    } else if (toBuild.length > 0 && tower.energy/tower.energyCapacity > 0.25) {
      let target = _.head(toBuild);
      if (target) {
        //tower.repair(target);
      }
    }

  }
};
