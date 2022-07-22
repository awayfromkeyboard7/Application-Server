const User = require("../../../models/user");
const Chat = require("../../../models/chat");
const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, async (gitId) => {
    if (gitId !== null) {
      // console.log("setGitId >>>>>>>> gitId: ", gitId);
      // 소켓
      UserSocket.setSocketId(gitId, socket.id);
      socket.gitId = gitId;

      const followerList = await User.getFollowerListWithGitId(socket.gitId);
      await Promise.all (followerList.filter(friend => {
        if (UserSocket.isExist(friend)) {
          socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", socket.gitId);
        }
      }))
    }
    if (!Chat.isExist(gitId)) {
      Chat.setChatLog(gitId, {})
    }
    // console.log("usersSocketId>>>", UserSocket.getSocketArray());
  });
}