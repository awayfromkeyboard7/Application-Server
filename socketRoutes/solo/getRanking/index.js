const GameRoom = require("../../../models/gameroom");
const GameLog = require("../../../models/gamelog");

module.exports = (socket, event) => {
  socket.on(event, async (id) => {
    console.log('getRanking >>>>>>>>>', id);
    const myRoom = GameRoom.getRoom(socket);
    let info = await GameLog.getLog(id);
    console.log('getRanking >>>>>>>>>', info);
    info["userHistory"].sort((a, b) => {
      if (a.passRate === b.passRate) {
        return a.submitAt - b.submitAt;
      } else {
        return b.passRate - a.passRate;
      }
    });
    socket.nsp.to(myRoom).emit(event, info["userHistory"], info["startAt"]);
  });
}