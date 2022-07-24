const GameRoom = require("../../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    try {
      const myRoom = await GameRoom.getRoom(socket);
      // console.log('BEFORE', myRoom, socket.rooms, GameRoom.room[myRoom[4]]);
      if (GameRoom.room[myRoom.slice(4)].status === 'waiting') {
        socket.emit(event, myRoom, 'waiting');
        GameRoom.setStatus(myRoom.slice(4), 'playing');
        // console.log('AFTER', GameRoom.room[myRoom[4]]);
      }
    } catch (e) {
      console.log(e)
    }
  })
}