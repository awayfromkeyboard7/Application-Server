const GameRoom = require("../../models/gameroom");

module.exports = (socket, event) => {
  socket.on("exitWait", async (userName) => {
    let myRoom = await GameRoom.getRoom(socket);
    const myRealRoom = myRoom;
    const idx = Number(myRoom?.replace("room", ""));
    console.log("exitWait >>>>>>", userName, myRoom, idx);
    // GameRoom.room[GameRoom.idx] = GameRoom.room[GameRoom.idx]?.filter((item) => item.gitId !== userName);
    GameRoom.setRoom(GameRoom.room[GameRoom.idx]?.filter((item) => item.gitId !== userName));
    console.log(GameRoom.room[GameRoom.idx]);
    socket.leave(myRealRoom);
    socket.to(myRealRoom).emit("exitWait", GameRoom.room[GameRoom.idx]);
  });
}
