const UserSocket = require("../../../models/usersocket");
const Chat = require("../../../models/chat");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (sender) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        Chat.resetUnreadCount(sender, gitId);
      }
    } catch (e) {
      console.log("[ERROR] resetUnreadCount :::: log: ", e);
    }
  })
}