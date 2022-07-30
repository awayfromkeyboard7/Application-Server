const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (data, bangjang) => {
    try {
      const teamRoomId = await teamGameRoom.getId(bangjang);
      socket.to(teamRoomId).emit("shareJudgedCode", data);
    } catch(e) {
      console.log(`[ERROR]/shareJudgeCode/${e.name}/${e.message}`);
    }
  });
}
