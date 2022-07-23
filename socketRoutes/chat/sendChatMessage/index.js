import { sendChat, getUnreadCount } from "../../../models/chat";
import { getSocketId } from "../../../models/usersocket";

export default (socket, event) => {
  socket.on(event, async (sender, receiver, message) => {
    console.log('send-message', message, getSocketId(receiver));
    sendChat(sender, receiver, message);
    const unreadMessage = await getUnreadCount(sender, receiver);
    console.log("unreadMessage :::: ", unreadMessage);
    socket.to(getSocketId(receiver)).emit('sendChatMessage', message);
    socket.to(getSocketId(receiver)).emit('unreadMessage', { senderId: sender, count: unreadMessage });
  });
}