function collectStats() {
if (Memory.stats == null) {
        Memory.stats = { tick: Game.time };
}
Memory.stats.cpu = Game.cpu;
Memory.stats.gcl = Game.gcl;
const memory_used = RawMemory.get().length;
    // console.log('Memory used: ' + memory_used);
    Memory.stats.memory = {
        used: memory_used,
        // Other memory stats here?
};



}

module.exports = {
  collectStats
};
