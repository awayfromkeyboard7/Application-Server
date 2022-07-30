const User = require("../../../models/db/user");
const UserSocket = require("../../../models/usersocket");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    try {
      const userInfo = await Auth.verify(socket.token);
      
      if (userInfo !== false) {
        const followingList = await User.getFollowingList(userInfo.userId);
        const result = await Promise.all (followingList.filter(friend => {
          return UserSocket.isExist(friend.gitId)
        }))
        socket.emit("getFollowingList", result);
      }
    } catch(e) {
      console.log(`[ERROR]/getFollowingList/${e.name}/${e.message}`);
    }
  })
}