const Chat = require("../../../models/chat");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (receiver) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        const myChatLogs = Chat.receiveChat(gitId, receiver);
        if (myChatLogs !== false) {
          socket.emit("receiveChatMessage", myChatLogs);
        }
      } else {
        socket.token = null;
      }
    } catch (e) {
      console.log("/socketRoutes/getChatMessage socket ERROR ::::");
    }
  });
}