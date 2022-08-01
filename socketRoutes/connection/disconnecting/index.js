const User = require("../../../models/db/user");
const Auth = require("../../../models/auth");
const GameRoom = require("../../../models/gameroom");
const TeamRoom = require("../../../models/teamroom");
const UserSocket = require("../../../models/usersocket");

module.exports = async (socket, event) => {
  await socket.on(event, async () => {
    // disconnected when solo play
    // calling socket.rooms in try&catch yields UNDEFINED ROOM!!!
    const socketrooms = socket.rooms;
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        if (socket.mode === 'solo') {
          GameRoom.setPrevRoom(socket.gitId, socketrooms);
          // console.log("before disconnecting ", GameRoom.prevRoom);
          GameRoom.deletePlayer(socket, socket.gitId);
          // console.log("after disconnecting ", GameRoom.prevRoom);

        }
        else if (socket.mode === 'team') {
          TeamRoom.setPrevRoom(socket);
          // console.log("before!!!!! disconnecting", TeamRoom.teamRoom);
          TeamRoom.deletePlayer(socket.bangjang, socket.gitId);
          // console.log("after!!!!! disconnecting", TeamRoom.teamRoom);
        }

        if (socket.id !== undefined) {
          const followerList = await User.getFollowerList(userInfo.userId);
          UserSocket.deleteSocketId(socket?.gitId)
  
          if (followerList !== undefined) {
            await Promise.all (followerList?.filter(friend => {
              if (UserSocket.isExist(friend)) {
                socket.to(UserSocket.getSocketId(friend)).emit("followingUserDisconnect", socket?.gitId);
              }
            }));
          }
        }
      }
    } catch(e) {
      console.log(`[ERROR]/disconnecting/${e.name}/${e.message}`);
    }
  })
}