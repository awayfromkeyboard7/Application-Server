const userSids = require('./usersocket');
// const GameRoom = require('./gameroom');

let intervalList = {};

function makeInterval(socket, roomId, timeLimit, mode) {
  deleteInterval(roomId, mode);

  interval = setInterval(() => {
    if (mode === "wait") {
      socket.nsp.to(roomId).emit("timeLimit", timeLimit - new Date());
      if (timeLimit < new Date()) {
        socket.nsp.to(roomId).emit("timeOut");
        if (interval) {
          clearInterval(interval);
        }
      }
    } 
    else {
      socket.nsp.to(roomId).emit("timeLimitCode", timeLimit - new Date());

      if (timeLimit < new Date()) {
        socket.nsp.to(roomId).emit("timeOutCode");
        if (interval) {
          clearInterval(interval);
        }
      }
    }
  }, 1000);
  intervalList[`${roomId}${mode}`] = interval;
}


function deleteInterval(roomId, mode) {
  clearInterval(intervalList[`${roomId}${mode}`]);
  delete intervalList[`${roomId}${mode}`];
}


module.exports = {
  makeInterval,
  deleteInterval,
};
