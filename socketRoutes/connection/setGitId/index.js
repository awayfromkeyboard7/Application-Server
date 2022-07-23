import { getFollowerListWithGitId } from "../../../models/db/user";
import { isExist, setChatLog } from "../../../models/chat";
import { setSocketId, isExist as _isExist, getSocketId } from "../../../models/usersocket";

export default (socket, event) => {
  socket.on(event, async (gitId) => {
    if (gitId !== null) {
      // 소켓
      setSocketId(gitId, socket.id);
      socket.gitId = gitId;

      const followerList = await getFollowerListWithGitId(socket.gitId);
      await Promise.all (followerList.filter(friend => {
        if (_isExist(friend)) {
          socket.to(getSocketId(friend)).emit("followingUserConnect", socket.gitId);
        }
      }))
    }
    if (!isExist(gitId)) {
      setChatLog(gitId, {})
    }
  });
}