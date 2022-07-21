const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId) => {
    const teamRoomId = await teamGameRoom.getId(roomId);
    const teamRoomPlayers = await teamGameRoom.getPlayers(roomId);
    socket.join(teamRoomId);
    socket.emit("getTeamInfo", teamRoomPlayers);
  });
}