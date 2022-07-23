import { receiveChat } from "../../../models/chat";

export default (socket, event) => {
  socket.on(event, (sender, receiver) => {
    try {
      const myChatLogs = receiveChat(sender, receiver);
      if (myChatLogs !== false) {
        socket.emit("receiveChatMessage", myChatLogs);
      }
    } catch (e) {
      console.log("/socketRoutes/getChatMessage socket ERROR :::: ", sender, receiver);
    }
  });
}