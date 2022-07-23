import UserSocket from "../../../models/usersocket";
import { resetUnreadCount } from "../../../models/chat";

export default (socket, event) => {
  socket.on(event, async (sender, receiver) => {
    resetUnreadCount(sender, receiver);
  })
}