const User = require("../../../models/db/user");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (targetGitId) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const nodeId = userInfo.nodeId;
        await User.following(nodeId, targetGitId);
      }
    } catch (e) {
      console.log(`[ERROR]/followMemeber/${e.name}/${e.message}`);
    }
  });
};