import { getRoom } from "../../../models/gameroom.js";
import { getLog } from "../../../models/db/gamelog.js";

export const submitCode = (socket, event) => {
  socket.on(event, async (gameLogId) => {
    let info = await getLog(gameLogId);
    const myRoom = getRoom(socket);
    info["userHistory"].sort((a, b) => {
      if (a.passRate === b.passRate) {
        return a.submitAt - b.submitAt;
      } else {
        return b.passRate - a.passRate;
      }
    });
    socket.nsp.to(myRoom).emit(event, info["userHistory"]);    
  });
}