const User = require("../../../models/db/user");
const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, async (nodeId) => {
    try {
      const followingList = await User.getFollowingList(nodeId);
      const result = await Promise.all (followingList.filter(friend => {
        return UserSocket.isExist(friend.gitId)
      }))
      socket.emit("getFollowingList", result);
    } catch (e) {
      console.log(`[getFollowingList Socket][ERROR] :::: nodeId: ${nodeId}`);
      console.log(`[getFollowingList Socket][ERROR] :::: log: ${e}`);
    }
  })
}