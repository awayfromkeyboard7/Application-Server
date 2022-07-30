const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");
const Auth = require("../../../models/auth");

// waitGame
module.exports = (socket, event) => {
  socket.on(event, async () => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {

        let idx = GameRoom.getIdx();
        // get out ghost!!!!!
        if (Object.keys(userInfo).length === 0) return;

        console.log('solo rooms before', GameRoom.room);
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

          // 유저가 8명이면 게임 자동 시작
          if (GameRoom.room[idx].players.length === 8) {
            socket.emit('getRoomId', `room${idx}`, 'waiting');
            GameRoom.setStatus(idx, 'playing');
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

        console.log('solo rooms after', GameRoom.room);
      
      }
    } catch(e) {
      console.log(`[ERROR]/waitGame/${e.name}/${e.message}`);
    }
  })
}