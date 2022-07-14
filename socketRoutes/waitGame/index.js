const GameRoom = require("../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {
    console.log('GameRoom>>>>', GameRoom.room)
    console.log('GameRoomIdx>>>>', GameRoom.idx)
    console.log('GameRoomlength>>>>', GameRoom.room.length)
    if (GameRoom.room.length === 0) {
      GameRoom.createRoom(userInfo);
      socket.join(`room${GameRoom.idx}`)
    } else if (GameRoom.room[GameRoom.idx].length < 8) {
      GameRoom.joinRoom(userInfo)
      const temp = new Set()
      const unique = GameRoom.room[GameRoom.idx].filter(item => {
        const alreadyHas = temp.has(item.gitId)
        temp.add(item.gitId)
        return !alreadyHas
      })
      GameRoom.setRoom(unique);
      socket.join(`room${GameRoom.idx}`);
    } else {
      GameRoom.increaseIdx();
      GameRoom.createRoom(userInfo);
      socket.join(`room${GameRoom.idx}`);
    }
    socket.nsp.to(`room${GameRoom.idx}`).emit('enterNewUser', GameRoom.room[GameRoom.idx])
    // io.in(`room${idx}`).emit('enterNewUser', room[idx])
  })
}