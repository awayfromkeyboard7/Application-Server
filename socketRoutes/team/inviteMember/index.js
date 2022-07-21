const UserSocket = require("../../../models/usersocket");

module.exports = (socket, event) => {
  socket.on(event, (gitId, friendGitId) => {
    console.log(`InviteMember >>>>>>>> ${gitId} => ${friendGitId}`)
    socket.to(UserSocket.getSocketId(friendGitId)).emit("comeon", gitId);
  });
}