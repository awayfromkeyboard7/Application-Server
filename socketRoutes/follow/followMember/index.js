const User = require("../../../models/db/user");

module.exports = (socket, event) => {
  socket.on(event, async (myNodeId, targetGitId) => {
    try {
      // console.log(`followMember >>>>>>>>>>>>>>>>> ${myNodeId} =====> ${targetGitId}`);
      await User.following(myNodeId, targetGitId);
    } catch (e) {
      console.log(e);
    }
  });
};