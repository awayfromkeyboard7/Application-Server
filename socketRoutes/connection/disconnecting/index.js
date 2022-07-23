import { getFollowerListWithGitId } from "../../../models/db/user";
import { getSocketArray, deleteSocketId, isExist, getSocketId } from "../../../models/usersocket";

export default (socket, event) => {
  socket.on(event, async () => {
    try {
      if (socket.id != undefined) {
        console.log("disconnecting usersSocketId >>>>>>>>>>>> ", getSocketArray())
        const followerList = await getFollowerListWithGitId(socket?.gitId);
        console.log("disconnecting socket.gitId >>>>>>>> ", socket?.gitId);
        deleteSocketId(socket?.gitId)
        if (followerList != undefined) {
          await Promise.all (followerList?.filter(friend => {
            if (isExist(friend)) {
              socket.to(getSocketId(friend)).emit("followingUserConnect", socket?.gitId);
            }
          }));
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}