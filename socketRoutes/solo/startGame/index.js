const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");

module.exports = (socket, event) => {
  socket.on(event, (gameLogId) => {
    console.log('startGame >>>>>>', gameLogId);
    // GameRoom.increaseIdx();
    // GameRoom.createRoom();
    const rooms = socket.rooms;

    for (let room of rooms) {
      if (room !== socket.id) {

        //게임 시작시 wait interval 삭제
        Interval.deleteInterval(room, "wait"); 
        // ready interval 시작
        // Interval.makeInterval(socket, room, new Date(), "ready");
        let timeLimit = new Date();
        timeLimit.setSeconds(timeLimit.getSeconds() + 5);
        
        const interval = setInterval(() => {
          socket.nsp.to(room).emit("timeLimit", timeLimit - new Date());
          if(timeLimit < new Date()) {
            clearInterval(interval);
          }
        }, 1000);

        setTimeout(() => {
          timeLimit = new Date();
          timeLimit.setMinutes(timeLimit.getMinutes() + 15);
          socket.nsp.to(room).emit(event, gameLogId);
          Interval.makeInterval(socket, room, timeLimit, "solo");

        }, 5000);
      }
    }
  });
}