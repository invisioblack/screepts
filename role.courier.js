const actions = require('creeps.actions');
const bodies = require('creeps.bodies');
const jobActions = require('jobs.actions');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.carry.energy == 0) {

       if (creep.memory.job) {
        let job = creep.memory.job;
        jobActions[job.action](creep, job);
      } else {
        creep.say('no job');
      }

    } else {
      // Proceed to the nearest building that needs energy and dump it
      // Prioritize spawns, then containers

      if (!actions.dumpEnergyAt(creep, STRUCTURE_SPAWN)) {
        if (!actions.dumpEnergyAt(creep, STRUCTURE_EXTENSION)) {
         actions.dumpEnergyAt(creep, STRUCTURE_STORAGE);
        }
      }

    }
  },

  spawnCondition: function(spawn) {
    let totalDropped = _.sum(_.map(spawn.room.memory.droppedEnergy, dropped => dropped.amount));
    let numCouriers = spawn.room.memory.myCreepsByRole.courier.length;
    let enoughEnergy = Math.floor(totalDropped/300) - (numCouriers || 0) > 0;

    let structs = spawn.room.memory.structuresByType;
    let unfilledStructures = _.filter(_.union(structs.spawn, structs.extension, structs.storage),
                              struct => {
                                if (struct.store) {
                                  return struct.store[RESOURCE_ENERGY] < struct.storeCapacity;
                                } else {
                                  return struct.energy < struct.energyCapacity;
                                }
                              });

    return enoughEnergy && unfilledStructures.length > 0;

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
