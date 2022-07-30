const GameRoom = require("../../../models/gameroom");
const GameLog = require("../../../models/db/gamelog");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (id) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
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
      }
    } catch(e) {
      console.log(`[ERROR]/getRanking/${e.name}/${e.message}`);
    }
  });
}