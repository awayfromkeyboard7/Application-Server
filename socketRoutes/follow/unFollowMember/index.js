const User = require("../../../models/user");

module.exports = (socket, event) => {
  socket.on(event, async (myNodeId, targetGitId) => {
    try {
      // console.log(`unFollowMember >>>>>>>>>>>>>>>>> ${myNodeId} =====> ${targetGitId}`);
      await User.unfollow(myNodeId, targetGitId);
    } catch (e) {
      console.log(e);
    }
  });
}