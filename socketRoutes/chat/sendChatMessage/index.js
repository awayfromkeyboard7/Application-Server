const Chat = require("../../../models/chat");
const Auth = require("../../../models/auth");
const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, async (receiver, message) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        
        Chat.sendChat(gitId, receiver, message);
        const unreadMessage = await Chat.getUnreadCount(gitId, receiver);
    
        socket.to(UserSocket.getSocketId(receiver)).emit('sendChatMessage', message);
        socket.to(UserSocket.getSocketId(receiver)).emit('unreadMessage', { senderId: gitId, count: unreadMessage });
      }
    } catch (e) {
      console.log("[ERROR] sendCahtMessage :::: log: ", e);
    }
  });
}