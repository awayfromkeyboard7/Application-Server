const teamGameRoom = require("../../../models/teamroom");
const User = require("../../../models/user");
const GameLog = require("../../../models/gamelog");
const Interval = require("../../../models/interval");

module.exports = (socket, event) => {
  socket.on("startMatching", async (roomId) => {
    const teamRoomId = await teamGameRoom.getId(roomId)
    socket.join(teamRoomId);
    // console.log(socket.rooms);
    // 팀전 매칭을 누르면 team room에 있는 인원 모두 매칭룸으로 이동
    const length = await teamGameRoom.getWaitingLength()
    if (length === 1) {
      // 새로고침하면 이미 내가 대기리스트에 있는 상태.
      const waitExist = await teamGameRoom.isWaitingExist(roomId);
      if (!waitExist) {
        const waitingRoomBangJang = await teamGameRoom.popFromWaitingList();
        const waitingRoomId = await teamGameRoom.getId(waitingRoomBangJang)
  
        const waitingRoomPlayers = await teamGameRoom.getPlayers(waitingRoomBangJang)
        const teamRoomPlayers = await teamGameRoom.getPlayers(roomId); 
  
        const gameLogId = await GameLog.createTeamLog(waitingRoomPlayers, teamRoomPlayers, waitingRoomId, teamRoomId);
        console.log(gameLogId);
        User.addGameLog(await GameLog.getLog(gameLogId));

        socket.nsp.to(waitingRoomId).emit("matchingComplete", waitingRoomPlayers, teamRoomPlayers);
        socket.nsp.to(teamRoomId).emit("matchingComplete", teamRoomPlayers, waitingRoomPlayers);

        let timeLimit = new Date();
        timeLimit.setSeconds(timeLimit.getSeconds() + 5);
        const firstTeamId = waitingRoomId;
        const secondTeamId = teamRoomId;
  
        const interval = setInterval(() => {
          socket.nsp.to([firstTeamId,secondTeamId]).emit("timeLimitCode", timeLimit - new Date());
          if(timeLimit < new Date()) {
            clearInterval(interval);
          }
  
        }, 1000);
  
        setTimeout(() => {
          timeLimit = new Date();
          timeLimit.setMinutes(timeLimit.getMinutes() + 15);
  
          // create gamelog for 2 teams.......
          
          // TODO1 양 팀의 유저들로 새 게임로그 생성
          // TODO2 client에서 teamGameStart 이벤트　on
          socket.nsp.to(waitingRoomId).emit("teamGameStart", waitingRoomBangJang, gameLogId);
          socket.nsp.to(teamRoomId).emit("teamGameStart", roomId, gameLogId);
          
          Interval.makeInterval(socket, [firstTeamId,secondTeamId], timeLimit, "team")
        }, 5001);
      }
     } else {
      console.log("teamgame should not be started yet!!!!!!!!");
      teamGameRoom.addToWaitingList(roomId);
    }
  });
}