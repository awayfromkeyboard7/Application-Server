import { unfollow } from "../../../models/db/user";

export default (socket, event) => {
  socket.on(event, async (myNodeId, targetGitId) => {
    try {
      // console.log(`unFollowMember >>>>>>>>>>>>>>>>> ${myNodeId} =====> ${targetGitId}`);
      await unfollow(myNodeId, targetGitId);
    } catch (e) {
      console.log(e);
    }
  });
}