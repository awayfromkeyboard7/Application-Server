const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (data, bangjang) => {
    console.log(data, bangjang)
    const teamRoomId = await teamGameRoom.getId(bangjang);
    socket.to(teamRoomId).emit("shareJudgedCode", data);
  });
}
