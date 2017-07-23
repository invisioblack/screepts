module.exports = {
  assignJobs: (room, creeps) => {
    let roomsToClaim = Memory.claimRooms;

    _.forEach(creeps, reclaimer => {

      let sortedRooms = _.sortBy(roomsToClaim, roomToClaim => Game.map.getRoomLinearDistance(room.name, roomToClaim));
      let closestRoom = _.head(sortedRooms);

      reclaimer.memory.job = {
        action: 'claimRoom',
        room: closestRoom,
        target: closestRoom
      }
    });
  }
}
