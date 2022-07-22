const GameRoom = require("../../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, async (userName) => {
    let myRoom = await GameRoom.getRoom(socket);
    const myRealRoom = myRoom;
    // console.log(">>>>>> EXIT >>>>>>>", userName);
    // GameRoom.setRoom(GameRoom.room[GameRoom.getIdx()]?.filter((item) => item.players.gitId !== userName));
    GameRoom.deleteUser(userName);
    // console.log(GameRoom.room[GameRoom.getIdx()]);
    // console.log("socket.rooms >>>>>>>>>>>>>>> before ", socket.rooms);
    socket.leaveAll();
    socket.join(socket.id);
    // console.log("socket.rooms >>>>>>>>>>>>>>> ", socket.rooms);
    socket.to(myRealRoom).emit("exitWait", GameRoom.room[GameRoom.getIdx()]);
  });
}
