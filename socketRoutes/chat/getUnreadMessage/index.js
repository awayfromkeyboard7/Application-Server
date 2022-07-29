const UserSocket = require("../../../models/usersocket");
const Chat = require("../../../models/chat");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (sender) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        const unreadCount = await Chat.getUnreadCount(sender, gitId);
        socket.emit('unreadMessage', { senderId: sender, count: unreadCount });
      }
    } catch (e) {
      console.log("[ERROR] getUnreadMessage :::: log: ", e);
    }
  });
}