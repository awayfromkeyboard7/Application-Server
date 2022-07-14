const GameRoom = require("../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, (gameLogId) => {
    console.log('startGame >>>>>>', gameLogId)
    GameRoom.increaseIdx();
    GameRoom.createRoom();
    const rooms = socket.rooms;
    for (let i of rooms) {
      if (i !== socket.id) {
        socket.nsp.to(i).emit(event, gameLogId);
        // io.in(i).emit(event, gameLogId);
      }
    }
  });
}