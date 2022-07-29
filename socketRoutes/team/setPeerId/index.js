const teamGameRoom = require("../../../models/teamroom");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (peerId, roomId) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        const teamRoomId = await teamGameRoom.getId(roomId);
        teamGameRoom.setPeerId(roomId, gitId, peerId);
        const teamRoomPeerId = teamGameRoom.getPeerId(roomId);
        
        socket.nsp.to(teamRoomId).emit("getPeerId", gitId, teamRoomPeerId);
      }
    } catch (e) {
      console.log("[ERROR] setPeerId :::: log: ", e);
    }
  });
}