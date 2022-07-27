const User = require("../../../models/db/user");

module.exports = (socket, event) => {
  socket.on(event, async (myNodeId, targetGitId) => {
    try {
      await User.unfollow(myNodeId, targetGitId);
    } catch (e) {
      console.log(`[unFollowMember Socket][ERROR] :::: myNodeId: ${myNodeId} targetGitId: ${targetGitId}`);
      console.log(`[unFollowMember Socket][ERROR] :::: log: ${e}`);
    }
  });
}