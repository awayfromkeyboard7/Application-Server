const GameRoom = require("../../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    try {
      const myRoom = await GameRoom.getRoom(socket);
      if (GameRoom.room[myRoom.slice(4)].status === 'waiting') {
        socket.emit(event, myRoom, 'waiting');
        GameRoom.setStatus(myRoom.slice(4), 'playing');
      }
    } catch (e) {
      console.log(`[getRoomId][ERROR] :::: log: ${e}`);
    }
  })
}