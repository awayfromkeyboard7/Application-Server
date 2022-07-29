const teamGameRoom = require("../../../models/teamroom");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (roomId) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        const avatarUrl = userInfo.avatarUrl;
        const teamRoomId = teamGameRoom.getId(roomId);
        socket.join(teamRoomId);
        let players = teamGameRoom.getPlayers(roomId);
        if (!(await players.map(item => item.gitId).includes(gitId))) {
          teamGameRoom.addPlayer(roomId, { gitId, avatarUrl });
          players = teamGameRoom.getPlayers(roomId);
        }
        socket.emit('setUsers', players);
      }
    } catch(e) {
      console.log("[ERROR] getUsers :::: log: ", e);
    }
  });
}