const teamGameRoom = require("../../../models/teamroom");
const GameRoom = require("../../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, async (gitId) => {
    console.log("exitWait roomId >>>>>>>>>>>>>> ", socket.bangjang);
    let myRoom = await GameRoom.getRoom(socket);
    GameRoom.setRoom(GameRoom.room[GameRoom.getIdx()]?.filter((item) => item.gitId !== gitId));
    try {
      if (teamGameRoom.isExist(gitId)) {
        const roomId = await teamGameRoom.getId(gitId);
        socket.nsp.to(roomId).emit("exitTeamGame", gitId);
        teamGameRoom.deleteId(gitId);
      } else {
        if (socket.bangjang !== undefined) {
          const teamRoom = await teamGameRoom.getRoom(socket.bangjang);
          const players = await Promise.all (teamRoom.players.filter(player => {
            return player.userInfo.gitId !== gitId
          }))
  
          await teamGameRoom.setPlayers(socket.bangjang, players);
          const newPlayers = await teamGameRoom.getPlayers(socket.bangjang);
          socket.to(teamRoom.id).emit("enterNewUserToTeam", newPlayers)
          socket.bangjang = undefined;
        } else {
          socket.to(myRoom).emit("exitWait", GameRoom.room[GameRoom.getIdx()]);
        }
      }
      // 모든방에서 나가진 후 자기 private room 입장
      socket.leaveAll();
      socket.join(socket.id);
    } catch(e) {
      console.log(`exitWait ERROR ::::::: gitId: ${gitId}`);
      console.log(`exitWait ERROR ::::::: log: ${e}`);
    }
  });
}