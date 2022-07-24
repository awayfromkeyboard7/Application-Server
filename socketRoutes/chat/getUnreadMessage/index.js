const UserSocket = require("../../../models/usersocket");
const Chat = require("../../../models/chat");

module.exports = (socket, event) => {
  socket.on(event, async (sender, receiver) => {
    // console.log("getUnreadMessage :::: ", sender, receiver);
    const unreadCount = await Chat.getUnreadCount(sender, receiver);
    // console.log("getUnreadMessage :::: ", sender, receiver, unreadCount);
    socket.emit('unreadMessage', { senderId: sender, count: unreadCount });
  });
}