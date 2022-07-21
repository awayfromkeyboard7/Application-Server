const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");

module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {
    console.log('GameRoom>>>>', GameRoom.room)
    console.log('GameRoomIdx>>>>', GameRoom.getIdx())
    console.log('GameRoomlength>>>>', GameRoom.room.length)
    const idx = GameRoom.getIdx();
    
    if (userInfo.size != 0) {
      if (GameRoom.room.length === 0) {
        GameRoom.createRoom(userInfo);
        socket.join(`room${idx}`);
  
        let timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 3);
        Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait")
      } else if (GameRoom.room[idx].length < 8) {
        if (GameRoom.room[idx].length == 0 ){
          Interval.deleteInterval(`room${idx}`,'wait')
          let timeLimit = new Date();
          timeLimit.setMinutes(timeLimit.getMinutes() + 3);
          Interval.makeInterval(socket,`room${idx}`,timeLimit,"wait")
        }
  
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
        GameRoom.increaseIdx();
        GameRoom.createRoom(userInfo);
        socket.join(`room${idx}`);
  
        let timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 3);
        Interval.makeInterval(socket, `room${idx}}`, timeLimit, "wait");
      }
    }
    socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx]);
  })
}