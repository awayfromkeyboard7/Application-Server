const teamGameRoom = require("../../../models/teamroom");
const GameLog = require("../../../models/gamelog");

module.exports = (socket, event) => {
  //팀전에서 게임 제출
  socket.on(event, async (gameLogId, bangjang) => {

    let gameLog = await GameLog.getLog(gameLogId);
    result = [gameLog["teamA"],gameLog["teamB"]];
  
    result.sort((a, b) => {
      if (a[0].passRate === b[0].passRate) {
        return a[0].submitAt - b[0].submitAt;
      } else {
        return b[0].passRate - a[0].passRate;
      }
    });
    const teamRoomId = await teamGameRoom.getId(bangjang);
    socket.nsp.to(gameLog["roomIdA"]).to(gameLog["roomIdB"]).emit("submitCodeTeam", result);
    socket.nsp.to(teamRoomId).emit("teamGameOver");
  });
}