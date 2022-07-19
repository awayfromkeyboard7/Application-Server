intervalList ={}

function makeInterval(socket, roomId,timeLimit) {
    let cnt = 0
    const interval = setInterval(() => {
        socket.nsp.to(roomId).emit("timeLimitCode", timeLimit - new Date());
        if(timeLimit < new Date()) {
            socket.nsp.to(roomId).emit("timeOutCode");
            if (interval){
            clearInterval(interval);
            }
        }

        console.log("bye interval cnt =", cnt)
    }, 1000);
    intervalList[roomId] = interval;
    cnt += 1
}


function deleteInterval(roomId) {
    console.log("isit clear??????!@?!@?")
    clearInterval(intervalList[roomId])
    }

module.exports = {
    makeInterval,
    deleteInterval
    };