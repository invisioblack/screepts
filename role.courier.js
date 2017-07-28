const actions = require('creeps.actions');
const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');

module.exports = {

  /** @param {Creep} creep **/
  run : function(creep) {
    if (creep.memory.job) {
      let job = creep.memory.job;
      jobActions[job.action](creep, job);
    } else {
      creep.say('no job');
    }
  },

  spawnCondition: function(spawn) {
    let totalDropped = _.sum(_.map(spawn.room.memory.droppedEnergy, dropped => dropped.amount));
    let numCouriers = 0;
    if (spawn.room.memory.myCreepsByRole.courier) {
      numCouriers = spawn.room.memory.myCreepsByRole.courier.length;
    }

    let containers = _.map(
      _.filter(spawn.room.memory.structuresByType.container, container => container.store[RESOURCE_ENERGY] > 0),
      container => Game.getObjectById(container.id).store[RESOURCE_ENERGY]
    );
    let containersSum = _.sum(containers);

    let enoughEnergy = Math.ceil((totalDropped+containersSum)/1000) - numCouriers > 0;

    let structs = spawn.room.memory.structuresByType;
    let unfilledStructures = _.filter(_.union(structs.spawn, structs.extension, structs.storage),
                              struct => {
                                if (struct.store) {
                                  return struct.store[RESOURCE_ENERGY] < struct.storeCapacity;
                                } else {
                                  return struct.energy < struct.energyCapacity;
                                }
                              });

    return enoughEnergy && Math.floor(unfilledStructures.length/numCouriers) > 5;

  },

  sizes: [
    [CARRY, MOVE],
    [CARRY, CARRY, MOVE, MOVE],
    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
  ],

  /** @param {StructureSpawn} spawn**/
  create: function(spawn) {
    let body = bodies.chooseLargestAffordable(spawn, this.sizes);
    if (body) {
      return spawn.createCreep(body, memory = {
        role: 'courier'
      });
    } else {
      return ERR_NOT_ENOUGH_ENERGY;
    }

  }
}
