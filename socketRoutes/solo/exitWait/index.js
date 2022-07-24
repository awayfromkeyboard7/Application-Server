const GameRoom = require("../../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, async (userName) => {
    let myRoom = await GameRoom.getRoom(socket);
    const myRealRoom = myRoom;
    GameRoom.deletePlayer(userName);
    socket.leaveAll();
    socket.join(socket.id);
    socket.to(myRealRoom).emit("exitWait", GameRoom.room[GameRoom.getIdx()]);
  });
}
