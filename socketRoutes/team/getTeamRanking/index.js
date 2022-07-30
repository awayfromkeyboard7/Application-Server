const GameLog = require("../../../models/db/gamelog");
const Auth = require("../../../models/auth");

// 팀전 결과 화면 랭킹
module.exports = (socket, event) => {
  socket.on(event, async (gameLogId) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        let gameLog = await GameLog.getLog(gameLogId);
        result = [gameLog["teamA"],gameLog["teamB"]];

        result.sort((a, b) => {
          if (a[0].passRate === b[0].passRate) {
            return a[0].submitAt - b[0].submitAt;
          } else {
            return b[0].passRate - a[0].passRate;
          }
        });
        socket.nsp.to(gameLog["roomIdA"]).to(gameLog["roomIdB"]).emit("getTeamRanking", result, gameLog["startAt"]);
      }
    } catch (e) {
      console.log(`[ERROR]/getTeamRanking/${e.name}/${e.message}`);
    }
  });
}