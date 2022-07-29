const teamGameRoom = require("../../../models/teamroom");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    // userId가 방장인 경우만 emit
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        const exist = await teamGameRoom.isExist(gitId)
        if (exist) {
          const roomId = await teamGameRoom.getId(gitId)
          socket.nsp.to(roomId).emit("goToMatchingRoom", gitId);
        }
      }
    } catch (e) {
      console.log("[ERROR] sendCahtMessage :::: log: ", e);
    }
  })
}