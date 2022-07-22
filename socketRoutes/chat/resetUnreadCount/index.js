const UserSocket = require("../../../models/usersocket");
const Chat = require("../../../models/chat");

module.exports = (socket, event) => {
  socket.on(event, async (sender, receiver) => {
    Chat.resetUnreadCount(sender, receiver);
  })
}