const Chat = require("../../../models/chat");
const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, async (sender, receiver, message) => {
    // console.log('send-message', message, UserSocket.getSocketId(receiver));
    Chat.sendChat(sender, receiver, message);
    const unreadMessage = await Chat.getUnreadCount(sender, receiver);
    // console.log("unreadMessage :::: ", unreadMessage);
    socket.to(UserSocket.getSocketId(receiver)).emit('sendChatMessage', message);
    socket.to(UserSocket.getSocketId(receiver)).emit('unreadMessage', { senderId: sender, count: unreadMessage });
  });
}