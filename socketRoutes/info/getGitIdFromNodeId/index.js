import { getUserInfoWithNodeId } from "../../../models/db/user";

// 확인 필요
export default (socket, event) => {
  socket.on("getGitIdFromNodeId", async (nodeId) => {
    // console.log(nodeId);
    const curId = await getUserInfoWithNodeId(nodeId);
  })
}