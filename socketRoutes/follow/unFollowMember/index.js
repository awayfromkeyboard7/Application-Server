const User = require("../../../models/db/user");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (friendId) => {
    try {
      const userInfo = await Auth.verify(socket.token);
      if (userInfo !== false) {
        await User.unfollow(userInfo.userId, friendId);
      }
    } catch (e) {
      console.log(`[ERROR]/unFollowMember/${e.name}/${e.message}`);
    }
  });
}