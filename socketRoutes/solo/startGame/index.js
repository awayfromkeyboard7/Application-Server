const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");

module.exports = (socket, event) => {
  socket.on(event, (gameLogId) => {
    console.log('startGame >>>>>>', gameLogId)
    GameRoom.increaseIdx();
    GameRoom.createRoom();
    const rooms = socket.rooms;

    console.log ("what is room@!#!#@!#!@#!@#!@#!@",rooms)
    for (let i of rooms) {
      if (i !== socket.id) {
        socket.nsp.to(i).emit(event, gameLogId);

        let timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 15);
    
        // console.log("passhere/??!?@!?@?!@?!@?!@?!@?",socket, i, timeLimit);
        Interval.makeInterval(socket, i,timeLimit);

        // const interval = setInterval(() => {
        //   socket.nsp.to(i).emit("timeLimitCode", timeLimit - new Date());
        //   if(timeLimit < new Date()) {
        //     socket.nsp.to(i).emit("timeOutCode");
        //     clearInterval(interval);
        //   }
        // }, 1000);
        //// io.in(i).emit(event, gameLogId);
      }
    }
  });
}