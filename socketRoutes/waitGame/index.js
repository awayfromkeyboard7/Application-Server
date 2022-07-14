const GameRoom = require("../../models/gameroom");

module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {
    console.log('GameRoom>>>>', GameRoom.room)
    console.log('GameRoomIdx>>>>', GameRoom.getIdx())
    console.log('GameRoomlength>>>>', GameRoom.room.length)
    const idx = GameRoom.getIdx();
    if (GameRoom.room.length === 0) {
      GameRoom.createRoom(userInfo);
      socket.join(`room${idx}`)
    } else if (GameRoom.room[idx].length < 8) {
      GameRoom.joinRoom(userInfo)
      const temp = new Set()
      console.log(idx)
      const unique = GameRoom.room[idx].filter(item => {
        const alreadyHas = temp.has(item.gitId)
        temp.add(item.gitId)
        return !alreadyHas
      })
      GameRoom.setRoom(unique);
      socket.join(`room${idx}`);
    } else {
      console.log("HERERERERERER????????");
      GameRoom.increaseIdx();
      GameRoom.createRoom(userInfo);
      socket.join(`room${idx}`);
    }
    socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx])
    // io.in(`room${idx}`).emit('enterNewUser', room[idx])
  })
}