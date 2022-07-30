const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId) => {
    try {
      const teamRoomId = await teamGameRoom.getId(roomId);
      const teamRoomPlayers = await teamGameRoom.getPlayers(roomId);
      socket.join(teamRoomId);
      socket.emit("getTeamInfo", teamRoomPlayers);
    } catch(e) {
      console.log(`[ERROR]/getTeamInfo/${e.name}/${e.message}`);
    }
  });
}