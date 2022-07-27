const User = require("../../../models/db/user");
const Chat = require("../../../models/chat");
const UserSocket = require("../../../models/usersocket");
const GameRoom = require("../../../models/gameroom");
const TeamRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (gitId, avatarUrl, mode, roomId) => {
    socket.mode = mode;
    try {
      if (mode === 'solo') {
        const prevRoom = GameRoom.getPrevRoom(gitId);
        if (prevRoom !== undefined) {
          socket.join(prevRoom);
        }
      }
      else if (mode === 'team') {
        if (socket.bangjang === undefined) {
          socket.bangjang = roomId;
        }
        const prevRoomId = TeamRoom.getId(socket.bangjang);
        if (prevRoomId !== undefined) {
          socket.join(prevRoomId);
          let players = TeamRoom.getPlayers(socket.bangjang);
          if (!(await players.map(item => item.gitId).includes(gitId))) {
            TeamRoom.addPlayer(socket.bangjang, { gitId, avatarUrl });
            players = TeamRoom.getPlayers(socket.bangjang);
          }
          socket.emit('setUsers', players);
        }
      }
      if (gitId !== null) {
        // 소켓
        UserSocket.setSocketId(gitId, socket.id);
        socket.gitId = gitId;
  
        const followerList = await User.getFollowerListWithGitId(socket.gitId);
        // console.log(followerList);
        await Promise.all (followerList?.filter(friend => {
          if (UserSocket.isExist(friend)) {
            socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", socket.gitId);
          }
        }))
      }
      if (!Chat.isExist(gitId)) {
        Chat.setChatLog(gitId, {})
      }
    } catch (e) {
      console.log(`[setGitId][ERROR] :::: gitId: ${gitId} avatarUrl: ${avatarUrl} mode: ${mode} roomId: ${roomId}`);
      console.log(`[setGitId][ERROR] :::: log: ${e}`);
    }
  });
}