const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");


// waitGame
module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {

    // console.log('GameRoomIdx>>>>', GameRoom.getIdx())
    // console.log('GameRoomlength>>>>', Object.keys(GameRoom.room).length)
    let idx = GameRoom.getIdx();
    // get out ghost!!!!!
    if (userInfo.size === 0) return;

    // 새 개인전룸 생성
    if (Object.keys(GameRoom.room).length === 0 || GameRoom.room[idx] === undefined) {
      GameRoom.createRoom(userInfo);
      socket.join(`room${idx}`);

      // 시간제한 설정
      let timeLimit = new Date();
      timeLimit.setMinutes(timeLimit.getMinutes() + 3);
      Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait")
    } 

    // 기존에 있던 개인전 대기룸에 들어감
    else if (GameRoom.room[idx].players.length < 8 && GameRoom.room[idx].status === 'waiting') {
      GameRoom.joinRoom(userInfo);
      const temp = new Set()
      const unique = GameRoom.room[idx].players.filter(item => {
        const alreadyHas = temp.has(item.gitId)
        temp.add(item.gitId)
        return !alreadyHas
      })
      // 새로고침 버그 막기
      GameRoom.setRoom(unique);
      socket.join(`room${idx}`);
    }
    else {
      idx = GameRoom.increaseIdx();
      GameRoom.createRoom(userInfo);
      socket.join(`room${idx}`);

      let timeLimit = new Date();
      timeLimit.setMinutes(timeLimit.getMinutes() + 3);
      Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait");
    }

    socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx].players);
    console.log('GameRoom AFTER>>>>', GameRoom.room, socket.rooms);
    if (GameRoom.room[idx].players.length === 8) {
      socket.emit('getRoomId', `room${idx}`, 'waiting');
      GameRoom.setStatus(myRoom.slice(4), 'playing');
    }
  })
}