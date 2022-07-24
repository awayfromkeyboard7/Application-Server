const User = require("../../../models/db/user");
const GameRoom = require("../../../models/gameroom");
const TeamRoom = require("../../../models/teamroom");
const UserSocket = require("../../../models/usersocket");

module.exports = async (socket, event) => {
  await socket.on(event, async () => {
    // disconnected when solo play
    // try&catch yields UNDEFINED ROOM!!!
    console.log(socket.rooms);
    if (socket.mode === 'solo') {
      GameRoom.setPrevRoom(socket);
      GameRoom.deletePlayer(socket, socket.gitId);
    }
    else if (socket.mode === 'team') {
      TeamRoom.setPrevRoom(socket);
      TeamRoom.deletePlayer(socket.bangjang, socket.gitId);
    }
    try {
      if (socket.id !== undefined) {

        const followerList = await User.getFollowerListWithGitId(socket?.gitId);

        // console.log("disconnecting socket.gitId >>>>>>>> ", socket?.gitId);
        UserSocket.deleteSocketId(socket?.gitId)
        // console.log('disconnecting SOCKET:::::::', UserSocket.usersSocketId);

        if (followerList !== undefined) {
          await Promise.all (followerList?.filter(friend => {
            if (UserSocket.isExist(friend)) {
              socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", socket?.gitId);
            }
          }));
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}