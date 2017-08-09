module.exports = {
  runLinks: (room) => {
    if (room.storage) {
      let links = _.map(room.memory.structuresByType.link, link => Game.getObjectById(link.id));
      let storageLink = room.storage.pos.findClosestByPath(links);

      _(links).difference(storageLink).forEach(link => {
        if(!link.cooldown && link.energy/link.energyCapacity > 0.75 && storageLink.energy < storageLink.energyCapacity) {
          link.transferEnergy(storageLink, Math.min(
            storageLink.energyCapacity - storageLink.energy,
            link.energy
          ));
        }
      });

    }

  }
}
