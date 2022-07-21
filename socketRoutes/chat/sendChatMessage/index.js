const Chat = require("../../../models/chat");
const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, (sender, receiver, message) => {
    console.log('send-message', message, UserSocket.getSocketId(receiver));
    Chat.sendChat(sender, receiver, message);
    socket.to(UserSocket.getSocketId(receiver)).emit('sendChatMessage', message);
  });
}