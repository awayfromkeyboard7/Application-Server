const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId, gitId, avatarUrl) => {
    // console.log("getUsers :::: ", roomId);
    // const teamRoom = await teamGameRoom.getRoom(roomId);
    const teamRoomId = teamGameRoom.getId(roomId);
    console.log("GET PLAYERS IN", teamRoomId);
    // console.log("getUsers :::: ", teamRoom);
    socket.join(teamRoomId);
    let players = await teamGameRoom.getPlayers(roomId);
    console.log("players gitId", gitId, players.map(item => item.gitId));
    console.log("gitId in players?", players.map(item => item.gitId).includes(gitId));
    if (!(players.map(item => item.gitId).includes(gitId))) {
      teamGameRoom.addPlayer(roomId, { gitId, avatarUrl }, true);
      players = teamGameRoom.getPlayers(roomId);
    }
    console.log("teamROOM :::::", JSON.stringify(teamGameRoom.teamRoom));
    console.log("PLAYERS :::::", players);
    socket.emit('setUsers', players);
    // try {

    // } catch(e) {
    //   console.log("getUsers ERROR :::: ", roomId);
    //   console.log("getUsers ERROR :::: ", e);
    // }
  });
}