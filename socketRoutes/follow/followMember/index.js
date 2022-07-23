import { following } from "../../../models/db/user";

export default (socket, event) => {
  socket.on(event, async (myNodeId, targetGitId) => {
    try {
      // console.log(`followMember >>>>>>>>>>>>>>>>> ${myNodeId} =====> ${targetGitId}`);
      await following(myNodeId, targetGitId);
    } catch (e) {
      console.log(e);
    }
  });
};