/*
  Return true if job is considered completed, false otherwise
*/
function buildAction(creep, job) {
  let constructionSite = Game.getObjectById(job.target);
  if (constructionSite) {
    var result = creep.build(constructionSite);
    if (result == ERR_NOT_IN_RANGE) {
      creep.moveTo(constructionSite);
    }
    return false;
  } else {
    delete creep.memory.job;
    return true;
  }
}
