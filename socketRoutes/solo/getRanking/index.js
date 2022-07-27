const GameRoom = require("../../../models/gameroom");
const GameLog = require("../../../models/db/gamelog");

module.exports = (socket, event) => {
  socket.on(event, async (id) => {
    try {
      const myRoom = GameRoom.getRoom(socket);
      let info = await GameLog.getLog(id);
      info["userHistory"].sort((a, b) => {
        if (a.passRate === b.passRate) {
          return a.submitAt - b.submitAt;
        } else {
          return b.passRate - a.passRate;
        }
      });
      socket.nsp.to(myRoom).emit(event, info["userHistory"], info["startAt"]);
    } catch(e) {
      console.log("[getRanking][ERROR] :::: id: ", id);
      console.log("[getRanking][ERROR] :::: log: ", e);
    }
  });
}