const User = require("../../../models/db/user");
const Chat = require("../../../models/chat");
const UserSocket = require("../../../models/usersocket");
const GameRoom = require("../../../models/gameroom");
const TeamRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (gitId, mode, roomId) => {
    socket.mode = mode;
    if (mode === 'solo') {
      const prevRoom = GameRoom.getPrevRoom(gitId);
      // console.log("PREVIOUS ROOM????", prevRoom, mode);
      if (prevRoom !== undefined) {
        socket.join(prevRoom);
      }
    }
    else if (mode === 'team' && roomId !== undefined) {
      console.log('setteamroom', mode, roomId);
      socket.bangjang = roomId;
      // const prevRoom = await TeamRoom.getPrevRoom(gitId);
      const prevRoomId = TeamRoom.getId(roomId);
      console.log(prevRoomId);
      // console.log(prevRoom, prevRoomId, TeamRoom.teamRoom[prevRoom]?.id);
      if (prevRoomId !== undefined) {
        // console.log(await TeamRoom.getId(prevRoom));
        socket.join(prevRoomId);
        // socket.join(teamGameRoom.getId(userInfo.gitId));
      }
    }
    if (gitId !== null) {
      // 소켓
      UserSocket.setSocketId(gitId, socket.id);
      socket.gitId = gitId;

      const followerList = await User.getFollowerListWithGitId(socket.gitId);
      console.log(followerList);
      await Promise.all (followerList.filter(friend => {
        if (UserSocket.isExist(friend)) {
          socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", socket.gitId);
        }
      }))
    }
    if (!Chat.isExist(gitId)) {
      Chat.setChatLog(gitId, {})
    }
    console.log('SETGITID SOCKET ROOMS""""', UserSocket.usersSocketId);

  });
}