const teamGameRoom = require("../../../models/teamroom");
const uuid = require("uuid");

module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {
    if (!(teamGameRoom.isExist(userInfo.gitId))) {
      const teamRoomId = uuid.v4();
      socket.join(teamRoomId);
      teamGameRoom.createRoom(userInfo.gitId, teamRoomId, userInfo)

      return () => {
        clearInterval(interval);
      };
    } else {
      socket.join(teamGameRoom.getId(userInfo.gitId));
    }
  });
}