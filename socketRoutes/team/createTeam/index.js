const teamGameRoom = require("../../../models/teamroom");
const uuid = require("uuid");

module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {
    try {
      console.log("current team room????", teamGameRoom.teamRoom);
      if (!(teamGameRoom.isExist(userInfo.gitId))) {
        console.log("refresh page SHOULD NOT be in here")
        const teamRoomId = uuid.v4();
        socket.join(teamRoomId);
        teamGameRoom.createRoom(userInfo.gitId, teamRoomId, userInfo)
        console.log("TEAMROOM after creation", JSON.stringify(teamGameRoom.teamRoom));
        return () => {
          clearInterval(interval);
        };
      } else {
        socket.join(teamGameRoom.getId(userInfo.gitId));
      }
    } catch (e) {
      console.log(`[createTeam][ERROR] :::: userInfo: ${userInfo}`);
      console.log(`[createTeam][ERROR] :::: log: ${e}`);
    }
  });
}