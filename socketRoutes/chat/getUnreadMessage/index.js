const UserSocket = require("../../../models/usersocket");
const Chat = require("../../../models/chat");

module.exports = (socket, event) => {
  socket.on(event, async (sender, receiver) => {
    try {
      const unreadCount = await Chat.getUnreadCount(sender, receiver);
      socket.emit('unreadMessage', { senderId: sender, count: unreadCount });
    } catch (e) {
      console.log(`[unreadCount][ERROR] :::: sender: ${sender} receiver: ${receiver}`);
      console.log(`[unreadCount][ERROR] :::: log: ${e}`);
    }
  });
}