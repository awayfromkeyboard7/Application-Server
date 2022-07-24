const User = require("../../../models/db/user");
const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    try {
      if (socket.id != undefined) {
        console.log("disconnecting usersSocketId >>>>>>>>>>>> ", UserSocket.getSocketArray())
        const followerList = await User.getFollowerListWithGitId(socket?.gitId);
        console.log("disconnecting socket.gitId >>>>>>>> ", socket?.gitId);
        UserSocket.deleteSocketId(socket?.gitId)
        if (followerList != undefined) {
          await Promise.all (followerList?.filter(friend => {
            if (UserSocket.isExist(friend)) {
              socket.to(UserSocket.getSocketId(friend)).emit("followingUserDisconnect", socket?.gitId);
            }
          }));
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}