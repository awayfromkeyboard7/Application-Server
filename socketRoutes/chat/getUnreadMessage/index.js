import UserSocket from "../../../models/usersocket";
import { getUnreadCount } from "../../../models/chat";

export default (socket, event) => {
  socket.on(event, async (sender, receiver) => {
    console.log("getUnreadMessage :::: ", sender, receiver);
    const unreadCount = await getUnreadCount(sender, receiver);
    console.log("getUnreadMessage :::: ", sender, receiver, unreadCount);
    socket.emit('unreadMessage', { senderId: sender, count: unreadCount });
  });
}