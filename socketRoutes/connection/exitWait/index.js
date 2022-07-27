const teamGameRoom = require("../../../models/teamroom");
const GameRoom = require("../../../models/gameroom");
// const Interval = require("../../../models/interval");

/* event: exitWait */
module.exports = (socket, event) => {
  socket.on(event, async (gitId) => {
    let myRoom = await GameRoom.getRoom(socket);
    // solo 일때 room{idx}형식.
    // team 일때 uuid형식 리턴 또는 undefined.
    // console.log('exitWait myRoom: ', myRoom)
    // console.log('exitWait total solo room: ', GameRoom.room)
    try {
      // mode: solo
      if (myRoom?.includes("room")) {
        // console.log("SOLO EXIT>>>>>>>>", GameRoom.room, socket.rooms);
        GameRoom.deletePlayer(socket, gitId);
        GameRoom.deletePrevRoom(gitId);
        // console.log("SOLO EXIT AFTER>>>>>>>>", GameRoom.room);
        // console.log("PLAYERS AFTER EXIT", GameRoom.room[myRoom.slice(4)]);
        if (GameRoom.room[myRoom.slice(4)] !== undefined) {
          socket.to(myRoom).emit(event, GameRoom.room[myRoom.slice(4)].players);
        }
      } 
      // mode: team
      else {
        // 팀전에서 방장이 exitWait call
        if (teamGameRoom.isExist(gitId)) {
          const roomId = await teamGameRoom.getId(gitId);
          socket.nsp.to(roomId).emit("exitTeamGame", gitId);
          teamGameRoom.deleteId(gitId);
        } else {
          // 팀전에서 팀원이 exitWait call
          if (socket.bangjang !== undefined) {
            const teamRoom = await teamGameRoom.getRoom(socket.bangjang);
            const players = await Promise.all(
              teamRoom.players.filter((player) => {
                return player.userInfo.gitId !== gitId;
              })
            );

            teamGameRoom.setPlayers(socket.bangjang, players);
            const newPlayers = teamGameRoom.getPlayers(socket.bangjang);
            socket.to(teamRoom.id).emit("enterNewUserToTeam", newPlayers);
            socket.bangjang = undefined;
          }
        }
      }
      // 모든방에서 나가진 후 자기 private room 입장
      socket.leaveAll();
      socket.join(socket.id);
      // console.log('exitWait myRoom: ', myRoom)
      console.log("exitWait total solo room after remove: ", GameRoom.room);
      console.log("exitWait total prev room after remove: ", GameRoom.prevRoom);
    } catch (e) {
      console.log(`exitWait ERROR ::::::: gitId: ${gitId}`);
      console.log(`exitWait ERROR ::::::: log: ${e}`);
    }
  });
};
