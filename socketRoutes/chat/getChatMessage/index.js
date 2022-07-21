const Chat = require("../../../models/chat");

module.exports = (socket, event) => {
  socket.on(event, (sender, receiver) => {
    try {
      const myChatLogs = Chat.receiveChat(sender, receiver);
      if (myChatLogs !== false) {
        socket.emit("receiveChatMessage", myChatLogs);
      }
    } catch (e) {
      console.log("/socketRoutes/getChatMessage socket ERROR :::: ", sender, receiver);
    }
  });
}