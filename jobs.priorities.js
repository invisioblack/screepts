CONSTRUCTION_PRIORITIES = {
  spawn: 1,
  extension: 2,
  tower: 5,
  storage: 10,
  container: 20,

  rampart: 45,
  constructedWall: 50,
  road: 100
};

SPAWNING_PRIORITIES = {
  'miner': 100,
  'towerfiller': 90,
  'courier': 75,
  'builder': 25,
  'repairman': 10,
  'spawnsupplier': 80,
  'upgrader': 25
}


module.exports = {
  CONSTRUCTION_PRIORITIES,
  SPAWNING_PRIORITIES
};
