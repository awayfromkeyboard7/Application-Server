const GameRoom = require("../../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, async (userName) => {
    let myRoom = await GameRoom.getRoom(socket);
    const myRealRoom = myRoom;
    console.log(">>>>>> EXIT >>>>>>>", userName);
    GameRoom.setRoom(GameRoom.room[GameRoom.getIdx()]?.filter((item) => item.gitId !== userName));
    console.log(GameRoom.room[GameRoom.getIdx()]);
    socket.leave(myRealRoom);
    socket.to(myRealRoom).emit("exitWait", GameRoom.room[GameRoom.getIdx()]);
  });
}
