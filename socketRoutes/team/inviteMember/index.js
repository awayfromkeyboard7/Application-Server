const UserSocket = require("../../../models/usersocket");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (friendGitId) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        const gitId = userInfo.gitId;
        const avatarUrl = userInfo.avatarUrl;
        socket.to(UserSocket.getSocketId(friendGitId)).emit("comeon", { gitId, avatarUrl });
      }
    } catch (e) {
      console.log(`[ERROR]/inviteMember/${e.name}/${e.message}`);
    }
  });
}