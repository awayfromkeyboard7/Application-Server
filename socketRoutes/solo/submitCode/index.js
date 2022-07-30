const GameRoom = require("../../../models/gameroom");
const GameLog = require("../../../models/db/gamelog");

module.exports = (socket, event) => {
  socket.on(event, async (gameLogId) => {
    let info = await GameLog.getLog(gameLogId);
    try {
      const myRoom = GameRoom.getRoom(socket);
      info["userHistory"].sort((a, b) => {
        if (a.passRate === b.passRate) {
          return a.submitAt - b.submitAt;
        } else {
          return b.passRate - a.passRate;
        }
      });
      socket.nsp.to(myRoom).emit(event, info["userHistory"]);    
    } catch (e) {
      console.log(`[ERROR]/submitCode/${e.name}/${e.message}`);
    }
  });
}