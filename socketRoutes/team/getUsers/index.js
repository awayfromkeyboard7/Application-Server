const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId, gitId, avatarUrl) => {
    try {
      const teamRoomId = teamGameRoom.getId(roomId);
      socket.join(teamRoomId);
      let players = teamGameRoom.getPlayers(roomId);
      if (!(await players.map(item => item.gitId).includes(gitId))) {
        teamGameRoom.addPlayer(roomId, { gitId, avatarUrl }, true);
        players = teamGameRoom.getPlayers(roomId);
      }
      socket.emit('setUsers', players);
    } catch(e) {
      console.log("getUsers ERROR :::: ", e);
    }
  });
}