const GameRoom = require("../../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    try {
      const myRoom = GameRoom.getRoom(socket);
      socket.emit('getRoomId', myRoom);
    } catch (e) {
      console.log(e)
    }
  })
}