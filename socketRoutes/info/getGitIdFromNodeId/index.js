const User = require("../../../models/db/user");

// 확인 필요
module.exports = (socket, event) => {
  socket.on("getGitIdFromNodeId", async (nodeId) => {
    // console.log(nodeId);
    const curId = await User.getUserInfoWithNodeId(nodeId);
  })
}