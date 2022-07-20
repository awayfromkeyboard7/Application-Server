const User = require("../../../models/user");
const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, async (nodeId) => {
    const followingList = await User.getFollowingList(nodeId);
    const result = await Promise.all (followingList.filter(friend => {
      if (UserSocket.isExist(friend.gitId)) {
        return friend
      }
    }))
    socket.emit("getFollowingList", result);
  })
}