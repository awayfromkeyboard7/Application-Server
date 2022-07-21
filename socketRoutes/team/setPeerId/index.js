const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (userId, peerId, roomId) => {
    const teamRoom = await teamGameRoom.getRoom(roomId);
    const teamRoomId = await teamGameRoom.getId(roomId);

    await teamGameRoom.setPeerId(roomId, userId, peerId);
    const teamRoomPeerId = await teamGameRoom.getPeerId(roomId);

    socket.broadcast.to(teamRoomId).emit("getPeerId", userId, teamRoomPeerId);
  });
}