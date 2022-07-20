const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");

module.exports = (socket, event) => {
  socket.on(event, (gameLogId) => {
    console.log('startGame >>>>>>', gameLogId)
    GameRoom.increaseIdx();
    GameRoom.createRoom();
    const rooms = socket.rooms;

    for (let i of rooms) {
      if (i !== socket.id) {

        //3분 뒤 시작 인터벌 삭제
        Interval.deleteInterval(i, "wait"); 

        let timeLimit = new Date();
        timeLimit.setSeconds(timeLimit.getSeconds() + 5);
        
        const interval = setInterval(() => {
          socket.nsp.to(i).emit("timeLimit", timeLimit - new Date());
          if(timeLimit < new Date()) {
            clearInterval(interval);
          }
        }, 1000);

        setTimeout(() => {
          timeLimit = new Date();
          timeLimit.setMinutes(timeLimit.getMinutes() + 15);
          socket.nsp.to(i).emit(event, gameLogId);
          Interval.makeInterval(socket, i, timeLimit, "solo");

        }, 5000);

        // socket.nsp.to(i).emit(event, gameLogId);
        // Interval.deleteInterval(i, "wait"); 
        // Interval.makeInterval(socket, i, timeLimit, "solo");

        // const interval = setInterval(() => {
        //   socket.nsp.to(i).emit("timeLimitCode", timeLimit - new Date());
        //   if(timeLimit < new Date()) {
        //     socket.nsp.to(i).emit("timeOutCode");
        //     clearInterval(interval);
        //   }
        // }, 1000);
        // io.in(i).emit(event, gameLogId);
      }
    }
  });
}