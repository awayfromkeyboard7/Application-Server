import { isExist, getId, deleteId, getRoom, setPlayers, getPlayers } from "../../../models/teamroom";
import { getRoom as _getRoom, room, deleteUser } from "../../../models/gameroom";
import Interval from "../../../models/interval";

export default (socket, event) => {
  socket.on(event, async (gitId) => {
    let myRoom = await _getRoom(socket);
    try {
      // 팀전에서 방장이 exitWait call
      if (isExist(gitId)) {
        const roomId = await getId(gitId);
        socket.nsp.to(roomId).emit("exitTeamGame", gitId);
        deleteId(gitId);
      } else {
         // 팀전에서 팀원이 exitWait call
        if (socket.bangjang !== undefined) {
          const teamRoom = await getRoom(socket.bangjang);
          const players = await Promise.all (teamRoom.players.filter(player => {
            return player.userInfo.gitId !== gitId
          }))
  
          setPlayers(socket.bangjang, players);
          const newPlayers = getPlayers(socket.bangjang);
          socket.to(teamRoom.id).emit("enterNewUserToTeam", newPlayers)
          socket.bangjang = undefined;
        } 

        else {
          console.log("SOLO EXIT>>>>>>>>", room, socket.rooms);
          deleteUser(socket, gitId);
          console.log("SOLO EXIT AFTER>>>>>>>>", room);
          // console.log("PLAYERS AFTER EXIT", GameRoom.room[myRoom[4]]);
          if (room[myRoom[4]] !== undefined) {
            socket.to(myRoom).emit(event, room[myRoom[4]].players);
          }
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