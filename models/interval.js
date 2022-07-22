const userSids = require('./usersocket');

let intervalList = {};

function deleteInterval(roomId, mode) {
  // console.log("DDDDD???", roomId, mode);
  // console.log("before showme interval list!@!@!@!#!@#!@#1",roomId, mode, `${roomId}${mode}`, intervalList[`${roomId}${mode}`])
  clearInterval(intervalList[`${roomId}${mode}`]);
  // console.log("before showme interval list!@!@!@!#!@#!@#1",intervalList)
  delete intervalList[`${roomId}${mode}`];
  console.log("after DELETE INTERVAL",roomId, mode, `${roomId}${mode}`, intervalList)
}

function makeInterval(socket, roomId, timeLimit, mode) {
  // console.log("BEFORE make interval value", roomId, mode, `${roomId}${mode}`, intervalList);
  deleteInterval(roomId, mode);
  let intervalId;
  intervalId = setInterval(() => {
    if (mode === "wait") {
      socket.nsp.emit("timeLimit", timeLimit - new Date());
      // socket.to(roomId).emit("timeLimit", timeLimit - new Date());
      console.log("where to emit TIME INTERVAL???????", roomId, mode, socket.rooms);
      console.log("SOCKET IDS???????", userSids.usersSocketId);
      if (timeLimit < new Date()) {
        // socket.to(roomId).emit("timeOut");
        socket.nsp.emit("timeOut");
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    } 
    // else if (mode === 'ready') {
    //   timeLimit.setSeconds(timeLimit.getSeconds() + 5);
    //   socket.nsp.to(roomId).emit("timeLimit", timeLimit - new Date());
    //   if(timeLimit < new Date()) {
    //     clearInterval(interval);
    //   }
    // } 
    else {
      socket.nsp.to(roomId).emit("timeLimitCode", timeLimit - new Date());
      console.log("where to emit TIME INTERVAL???????", roomId, mode, socket.rooms);
      if (timeLimit < new Date()) {
        socket.nsp.to(roomId).emit("timeOutCode");
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    }
    // console.log("@@@@@@@@room id & mode@@@@@@", roomId, mode )
    // console.log(intervalList)
  }, 1000);
  // console.log("INTERVALID?????", intervalId);
  intervalList[`${roomId}${mode}`] = intervalId;
  // console.log("make interval value @!#!",roomId, mode, `${roomId}${mode}`, intervalList);
}



module.exports = {
  makeInterval,
  deleteInterval,
};
