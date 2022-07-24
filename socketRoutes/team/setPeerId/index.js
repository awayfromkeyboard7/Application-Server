const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (userId, peerId, roomId) => {
    // console.log("setPeerID Socket :::: ", userId, peerId, roomId);
    const teamRoomId = await teamGameRoom.getId(roomId);

    teamGameRoom.setPeerId(roomId, userId, peerId);
    const teamRoomPeerId = teamGameRoom.getPeerId(roomId);
    socket.nsp.to(teamRoomId).emit("getPeerId", userId, teamRoomPeerId);
  });
}