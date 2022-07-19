const GameRoom = require("../../../models/gameroom");

let usersSocketId = {};

module.exports = (socket, event) => {
  socket.on(event, async (gitId) => {
    if (gitId !== null) {
      console.log("setGitId >>>>>>>> gitId: ", gitId);
      usersSocketId[gitId] = socket.id;
      socket.gitId = gitId;
      const followerList = await User.getFollowerListWithGitId(socket.gitId);
      await Promise.all (followerList.filter(friend => {
        if (friend in usersSocketId) {
          socket.to(usersSocketId[friend]).emit("followingUserConnect", socket.gitId);
        }
      }))
    }
  });
}
