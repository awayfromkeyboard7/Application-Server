const userSids = require('./usersocket');
// const GameRoom = require('./gameroom');

let intervalList = {};

function makeInterval(socket, roomId, timeLimit, mode) {
  // console.log("BEFORE make interval value", roomId, mode, `${roomId}${mode}`, intervalList);
  deleteInterval(roomId, mode);

  interval = setInterval(() => {
    if (mode === "wait") {
      socket.nsp.to(roomId).emit("timeLimit", timeLimit - new Date());
      // console.log("where to emit TIME INTERVAL???????", roomId, mode, socket.rooms);
      // console.log("SOCKET IDS???????", userSids.usersSocketId);
      // console.log("GAME ROOM???????", GameRoom);
      if (timeLimit < new Date()) {
        socket.nsp.to(roomId).emit("timeOut");
        if (interval) {
          clearInterval(interval);
        }
      }
    } 
    else {
      socket.nsp.to(roomId).emit("timeLimitCode", timeLimit - new Date());
      // console.log("where to emit TIME INTERVAL???????", roomId, mode, socket.rooms);
      // console.log("SOCKET IDS???????", userSids.usersSocketId);
      // console.log("GAME ROOM???????", JSON.stringify(GameRoom.room));

      if (timeLimit < new Date()) {
        socket.nsp.to(roomId).emit("timeOutCode");
        if (interval) {
          clearInterval(interval);
        }
      }
    }
    // console.log("@@@@@@@@room id & mode@@@@@@", roomId, mode )
    // console.log(intervalList)
  }, 1000);
  // console.log("INTERVALID?????", intervalId);
  intervalList[`${roomId}${mode}`] = interval;
  // console.log("make interval value @!#!",roomId, mode, `${roomId}${mode}`, intervalList);
}


function deleteInterval(roomId, mode) {
  // console.log("DDDDD???", roomId, mode);
  // console.log("before showme interval list!@!@!@!#!@#!@#1",roomId, mode, `${roomId}${mode}`, intervalList[`${roomId}${mode}`])
  // console.log("DELETE THIS INTERVAL", intervalList[`${roomId}${mode}`]);
  clearInterval(intervalList[`${roomId}${mode}`]);
  // console.log("before showme interval list!@!@!@!#!@#!@#1",intervalList)
  delete intervalList[`${roomId}${mode}`];
  // console.log("after DELETE INTERVAL",roomId, mode, `${roomId}${mode}`, intervalList)
}


module.exports = {
  makeInterval,
  deleteInterval,
};
