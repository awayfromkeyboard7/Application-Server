let intervalList ={}

function makeInterval(socket, roomId, timeLimit, mode) {
    // console.log("howmany???!#?!@#?")
    // let key = false
    // if (mode == "team"){
    //     key = `${roomId[0]}${roomId[1]}`
    // }
    // else {
    //     key = `${roomId}${mode}`
    // }
    // console.log("isit same!#!@#!#!#!@#",key);
    const interval = setInterval(() => {
        // console.log("why crash?!?#!?#?!#?!",roomId, mode);
        if(mode === "wait") {
            socket.nsp.to(roomId).emit("timeLimit", timeLimit - new Date());
        } else {
            socket.nsp.to(roomId).emit("timeLimitCode", timeLimit - new Date());
        }
        console.log("@@@@@@@@room id & mode@@@@@@", roomId, mode )
        // console.log(intervalList)
        if(timeLimit < new Date()) {
            socket.nsp.to(roomId).emit("timeOutCode");
            if (interval){
            clearInterval(interval);
            }
        }
    }, 1000);
    intervalList[`${roomId}${mode}`] = interval;
    // console.log("make interval value @!#!",intervalList[key]);
}


function deleteInterval(roomId, mode) {
    // let key = false
    // if (mode == "team"){
    //     key = `${roomId[0]}${roomId[1]}`
    // }else {
    //     key = `${roomId}${mode}`
    // }
    // console.log("isit clear??????!@?!@?", roomId, mode)
    // console.log("isit clear??????!@?!@?", key)
    // console.log(is,key);
    // console.log("clear interval value!@!@!@#!@#!#",intervalList[key])
    clearInterval(intervalList[`${roomId}${mode}`])
    // console.log("before showme interval list!@!@!@!#!@#!@#1",intervalList)
    delete intervalList[`${roomId}${mode}`]
    // console.log("after showme interval list!@!@!@!#!@#!@#1",intervalList)

    // intervalList.remove(key);
    }

module.exports = {
    makeInterval,
    deleteInterval
    };