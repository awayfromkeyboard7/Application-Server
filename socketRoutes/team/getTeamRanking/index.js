const GameLog = require("../../../models/db/gamelog");

// 팀전 결과 화면 랭킹
module.exports = (socket, event) => {
  socket.on(event, async (gameLogId) => {

    let gameLog = await GameLog.getLog(gameLogId);
    // console.log("teamgame log info!!!!!!!", info);
    result = [gameLog["teamA"],gameLog["teamB"]];
    // console.log(result)
    result.sort((a, b) => {
      if (a[0].passRate === b[0].passRate) {
        return a[0].submitAt - b[0].submitAt;
      } else {
        return b[0].passRate - a[0].passRate;
      }
    });
    socket.nsp.to(gameLog["roomIdA"]).to(gameLog["roomIdB"]).emit("getTeamRanking", result, gameLog["startAt"]);
    // 팀 랭킹 확인 후 자동으로 룸에서 나가야 함 (확인 필요)
    // console.log("userLeft", gameLog["totalUsers"]);
    // if (gameLog["totalUsers"] === -1) {
    //   socket.leaveAll();
    //   socket.join(socket.id)
    // }
  });
}