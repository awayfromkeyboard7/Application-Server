import { getRoom } from "../../../models/gameroom.js";
import { getLog } from "../../../models/db/gamelog.js";

export default (socket, event) => {
  socket.on(event, async (id) => {
    // console.log('getRanking >>>>>>>>>', id);
    const myRoom = getRoom(socket);
    let info = await getLog(id);
    // console.log('getRanking >>>>>>>>>', info);
    info["userHistory"].sort((a, b) => {
      if (a.passRate === b.passRate) {
        return a.submitAt - b.submitAt;
      } else {
        return b.passRate - a.passRate;
      }
    });
    socket.nsp.to(myRoom).emit(event, info["userHistory"], info["startAt"]);
  });
}