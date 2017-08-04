const actions = require('creeps.actions');
const bodies = require('creeps.bodies');

module.exports = {
  run: function(creep) {
    if (!creep.memory.target) {
      let towers = _.filter(creep.room.memory.structuresByType.tower, struct => struct.energy < struct.energyCapacity);
      towers = _.map(towers, 'id');
      let towerfillerTargets = _.map(creep.room.memory.myCreepsByRole.towerfiller, 'memory.target');
      let availableTargets = _.reject(towers, t => _.includes(towerfillerTargets, t));
      if (availableTargets.length > 0) {
        creep.memory.target = _.head(availableTargets);
      }
    }

    if(creep.carry.energy < creep.carryCapacity) {
      if (!actions.withdrawFromNearestStorage(creep)) {
        if (!actions.withdrawFromNearestContainer(creep)) {
          actions.recycleSelf(creep);
          creep.say('no energy');
        }
      }
    } else {
      let tower = Game.getObjectById(creep.memory.target);
      if (tower && tower.energy < tower.energyCapacity) {
        let target = Game.getObjectById(tower.id);
        let result = creep.transfer(target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      } else if (tower && tower.energy == tower.energyCapacity) {
        creep.memory.role = 'upgrader';
      }

    }
  },
  spawnCondition: function(spawn) {
    let numTowerfillers = 0;
    if (spawn.room.memory.myCreepsByRole.towerfiller) {
      numTowerfillers = spawn.room.memory.myCreepsByRole.towerfiller.length;
    }
    let towers = _.filter(spawn.room.memory.structuresByType.tower, struct => struct.energy < struct.energyCapacity);
    let storage = spawn.room.storage && spawn.room.storage.store[RESOURCE_ENERGY] > 0;
    let containers = _.filter(spawn.room.memory.structuresByType.container, struct => struct.store[RESOURCE_ENERGY] > 0);

    return (towers.length > numTowerfillers) && (storage || containers.length > 0);
  },

  sizes: [
    [CARRY, MOVE],
    [CARRY, CARRY, MOVE, MOVE],
    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  ],

  create: function(spawn, memory) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = Object.assign({}, {role: 'towerfiller'}, memory));
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }
  }
}
