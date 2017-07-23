module.exports = {
  assignJobs: (room, creeps) => {
    let roomsToClaim = Memory.claimRooms;

    _.forEach(creeps, reclaimer => {

      let sortedRooms = _.sortBy(roomsToClaim, roomToClaim => Game.map.getRoomLinearDistance(room.name, roomToClaim));
      let closestRoom = _.head(sortedRooms);
      console.log('closest:',closestRoom);

      reclaimer.memory.job = {
        action: 'claimRoom',
        room: closestRoom,
        target: closestRoom
      }
      console.log(reclaimer);
      console.log(reclaimer.memory.job);

    });
  }
}
