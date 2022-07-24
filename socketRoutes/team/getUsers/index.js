const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId) => {
    try {
      // console.log("getUsers :::: ", roomId);
      // const teamRoom = await teamGameRoom.getRoom(roomId);
      const teamRoomId = teamGameRoom.getId(roomId);
      console.log("GET PLAYERS IN", teamRoomId);
      // console.log("getUsers :::: ", teamRoom);
      socket.join(teamRoomId);
      const players = await teamGameRoom.getPlayers(roomId);
      console.log(players);
      socket.emit('setUsers', players);
    } catch(e) {
      console.log("getUsers ERROR :::: ", roomId);
      console.log("getUsers ERROR :::: ", e);
    }
  });
}