const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, (userInfo, friendGitId) => {
    console.log(`InviteMember >>>>>>>> ${userInfo.gitId} => ${friendGitId}`)
    socket.to(UserSocket.getSocketId(friendGitId)).emit("comeon", userInfo);
  });
}