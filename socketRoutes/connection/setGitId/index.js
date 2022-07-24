const User = require("../../../models/db/user");
const Chat = require("../../../models/chat");
const UserSocket = require("../../../models/usersocket");
const GameRoom = require("../../../models/gameroom");
const TeamRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (gitId, avatarUrl, mode, roomId) => {
    socket.mode = mode;
    if (mode === 'solo') {
      const prevRoom = GameRoom.getPrevRoom(gitId);
      // console.log("PREVIOUS ROOM????", prevRoom, mode);
      if (prevRoom !== undefined) {
        socket.join(prevRoom);
      }
    }
    else if (mode === 'team') {
      if (socket.bangjang === undefined) {
        socket.bangjang = roomId;
      }

      console.log('setteamroom', mode, socket.bangjang);
      // const prevRoom = await TeamRoom.getPrevRoom(gitId);
      const prevRoomId = TeamRoom.getId(socket.bangjang);
      // console.log(prevRoomId);
      // console.log(prevRoom, prevRoomId, TeamRoom.teamRoom[prevRoom]?.id);
      if (prevRoomId !== undefined) {
        // console.log(await TeamRoom.getId(prevRoom));
        socket.join(prevRoomId);
        // socket.join(teamGameRoom.getId(userInfo.gitId));
        let players = TeamRoom.getPlayers(socket.bangjang);
        // console.log("players gitId", gitId, players.map(item => item.gitId));
        // console.log("gitId in players?", players.map(item => item.gitId).includes(gitId));
        if (!(players.map(item => item.gitId).includes(gitId))) {
          TeamRoom.addPlayer(socket.bangjang, { gitId, avatarUrl });
          players = TeamRoom.getPlayers(socket.bangjang);
        }
        console.log("teamROOM after reconnecting:::::", JSON.stringify(TeamRoom.teamRoom));
        console.log("PLAYERS :::::", players);
        socket.emit('setUsers', players);
      }
      // const teamRoomId = TeamRoom.getId(roomId);
      // console.log("GET PLAYERS IN", teamRoomId);
      // // console.log("getUsers :::: ", teamRoom);
      // socket.join(teamRoomId);


    }
    if (gitId !== null) {
      // 소켓
      UserSocket.setSocketId(gitId, socket.id);
      socket.gitId = gitId;

      const followerList = await User.getFollowerListWithGitId(socket.gitId);
      // console.log(followerList);
      await Promise.all (followerList.filter(friend => {
        if (UserSocket.isExist(friend)) {
          socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", socket.gitId);
        }
      }))
    }
    if (!Chat.isExist(gitId)) {
      Chat.setChatLog(gitId, {})
    }
    // console.log('SETGITID SOCKET ROOMS""""', UserSocket.usersSocketId);

  });
}