import { getFollowingList } from "../../../models/db/user";
import { isExist } from "../../../models/usersocket";

export default (socket, event) => {
  socket.on(event, async (nodeId) => {
    const followingList = await getFollowingList(nodeId);
    const result = await Promise.all (followingList.filter(friend => {
      return isExist(friend.gitId)
    }))
    socket.emit("getFollowingList", result);
  })
}