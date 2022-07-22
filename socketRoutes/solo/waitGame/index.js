const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");


// waitGame
module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {

    console.log('GameRoom>>>>', GameRoom.room)
    // console.log('GameRoomIdx>>>>', GameRoom.getIdx())
    // console.log('GameRoomlength>>>>', Object.keys(GameRoom.room).length)
    let idx = GameRoom.getIdx();
    // console.log('cur idx?????', idx);
    // console.log('GameRoomStatus>>>>', GameRoom.room[idx])

    // get out ghost!!!!!
    if (userInfo.size === 0) return;

    // 새 개인전룸 생성
    if (Object.keys(GameRoom.room).length === 0 || GameRoom.room[idx] === undefined) {
      GameRoom.createRoom(userInfo);
      socket.join(`room${idx}`);

      // 시간제한 설정
      // Interval.deleteInterval(`room${idx}`, 'wait');
      let timeLimit = new Date();
      timeLimit.setMinutes(timeLimit.getMinutes() + 3);
      Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait")
    } 

    // 기존에 있던 개인전 대기룸에 들어감
    else if (GameRoom.room[idx].players.length < 8 && GameRoom.room[idx].status === 'waiting') {
      // if (GameRoom.room[idx].players.length == 0) {
      //   console.log("HERE DELETE INTERVAL at WAITGAME");
      //   Interval.deleteInterval(`room${idx}`,'wait')
      //   let timeLimit = new Date();
      //   timeLimit.setMinutes(timeLimit.getMinutes() + 3);
      //   Interval.makeInterval(socket,`room${idx}`,timeLimit,"wait")
      // }
      GameRoom.joinRoom(userInfo);
      const temp = new Set()
      const unique = GameRoom.room[idx].players.filter(item => {
        const alreadyHas = temp.has(item.gitId)
        temp.add(item.gitId)
        return !alreadyHas
      })
      // 새로고침 버그 막으려고
      GameRoom.setRoom(unique);
      socket.join(`room${idx}`);
    }
    else {
      idx = GameRoom.increaseIdx();
      GameRoom.createRoom(userInfo);
      socket.join(`room${idx}`);

      // Interval.deleteInterval(`room${idx}`, 'wait');

      let timeLimit = new Date();
      timeLimit.setMinutes(timeLimit.getMinutes() + 3);
      Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait");
    }

    socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx].players);
    console.log('GameRoom AFTER>>>>', GameRoom.room, socket.rooms);
    // console.log('GameRoomIdx AFTER>>>>', GameRoom.getIdx())
    // console.log('GameRoomlength AFTER>>>>', Object.keys(GameRoom.room).length)
  })
}