const teamRoom = {};
let waitingList = [];
const prevRoom = {};

function isExist(gitId) {
  if (gitId in teamRoom) {
    return true;
  } else {
    return false;
  }
}

function createRoom(gitId, id, userInfo) {
  teamRoom[gitId] = { id: id, players: [{ userInfo: userInfo, peerId: '' }]}
  // console.log("createRoom :::: ", gitId, id, teamRoom[gitId])
}

function getRoom(bangjang) {
  if (isExist(bangjang)) {
    return teamRoom[bangjang]
  }
}

function getId(bangjang) {
  const room = getRoom(bangjang)
  if (room !== undefined){
    return room.id
  }
}

function deleteId(bangjang) {
  delete teamRoom[bangjang];
}

function setPlayers(bangjang, players) {
  teamRoom[bangjang].players = players;
  // console.log("setPlayers :::: ", teamRoom[bangjang].players);
}

function addPlayer(bangjang, userInfo) {
  teamRoom[bangjang].players.push({ userInfo: userInfo, peerId: '' });
  // console.log("addPlayer :::: ", teamRoom[bangjang].players)
}

function getPlayers(bangjang) {
  const temp = [];
  // console.log("bangjang :::: ", bangjang);
  if (isExist(bangjang) && bangjang !== undefined) {
    for (const info of teamRoom[bangjang]?.players) {
      temp.push(info.userInfo);
    }
    return temp;
  } else {
    return false;
  }
}

function deletePlayer(bangjang, gitId) {
  teamRoom[bangjang].players = teamRoom[bangjang].players.filter(item => item.userInfo.gitId !== gitId);
}

function addToWaitingList(bangjang) {
  waitingList.push(bangjang);
}

function popFromWaitingList() {
  const bangjang = waitingList[0];
  waitingList = [];
  return bangjang;
}

function getWaitingLength() {
  return waitingList.length
}

function isWaitingExist(roomId) {
  if (waitingList.includes(roomId)) {
    return true;
  } else {
    return false;
  }
}

function setPeerId(roomId, gitId, peerId) {
  try {
    for (const info of teamRoom[roomId].players) {
      if (info.userInfo.gitId === gitId) {
        info.peerId = peerId;
        return
      }
    }
  } catch(e) {
    console.log("setPeerId ERROR :::: ", gitId, peerId);
    console.log("setPeerId ERROR :::: ", e);
  }
}

function getPeerId(gitId) {
  const temp = {};
  try {
    for (const info of teamRoom[gitId].players) {
      temp[info.userInfo.gitId] = info.peerId;
    }
    return temp;
  } catch (e) {
    console.log("setPeerId ERROR gitId :::: ", gitId);
    console.log("setPeerId ERROR log :::: ", e);
  }
}

function getPrevRoom(gitId) {
  return prevRoom[gitId];
}

function setPrevRoom(socket) {
  prevRoom[socket.gitId] = socket.bangjang;
  console.log("asdfasdfasdfasdfadsf",prevRoom);
}

module.exports = {
  teamRoom,
  isExist,
  createRoom,
  getRoom,
  getId,
  deleteId,
  setPlayers,
  addPlayer,
  getPlayers,
  deletePlayer,
  addToWaitingList,
  popFromWaitingList,
  getWaitingLength,
  isWaitingExist,
  setPeerId,
  getPeerId,
  setPrevRoom,
  getPrevRoom
}