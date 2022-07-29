const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");


// waitGame
module.exports = (socket, event) => {
  socket.on(event, (userInfo) => {

    try {
      // get out ghost!!!!!
      if (Object.keys(userInfo).length === 0) return;
  

      let idx = GameRoom.getIdx();

      // 새 개인전룸 생성
      if (Object.keys(GameRoom.room).length === 0 || GameRoom.room[idx] === undefined) {
        GameRoom.createRoom(userInfo);
        socket.join(`room${idx}`);
  
        // 시간제한 설정
        let timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 3);
        Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait")

        socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx].players);

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
        GameRoom.setRoom(unique);
        socket.join(`room${idx}`);
        socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx].players);

        // 방이 다 차면 자동으로 게임 시작
        if (GameRoom.room[idx].players.length === 8) {
          socket.emit('getRoomId', `room${idx}`, 'waiting');
          GameRoom.setStatus(myRoom.slice(4), 'playing');
        }
      }
      else {
        idx = GameRoom.increaseIdx();
        GameRoom.createRoom(userInfo);
        socket.join(`room${idx}`);
  
        let timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 3);
        Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait");

        socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx].players);

      }
    } catch (e) {
      console.log(`[waitGame][ERROR] :::: userInfo: ${userInfo}`);
      console.log(`[waitGame][ERROR] :::: log: ${e}`);
    }
  })
}