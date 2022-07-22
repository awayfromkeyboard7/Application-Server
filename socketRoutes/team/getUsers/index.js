const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId) => {
    try {
      console.log("getUsers :::: ", roomId);
      const teamRoom = await teamGameRoom.getRoom(roomId);
      const teamRoomId = await teamGameRoom.getId(roomId);
      console.log("getUsers :::: ", teamRoom);
      socket.join(teamRoomId);
      const players = await teamGameRoom.getPlayers(roomId);
      socket.emit('setUsers', players);
    } catch(e) {
      console.log("getUsers ERROR :::: ", roomId);
      console.log("getUsers ERROR :::: ", e);
    }

  });
}