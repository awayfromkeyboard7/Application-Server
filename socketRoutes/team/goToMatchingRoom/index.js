const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (userId) => {
    // userId가 방장인 경우만 emit
    const exist = await teamGameRoom.isExist(userId)
    if (exist) {
      console.log("goToMatching :::: ", userId);
      const roomId = await teamGameRoom.getId(userId)
      socket.nsp.to(roomId).emit("goToMatchingRoom", userId);
    }
  })
}