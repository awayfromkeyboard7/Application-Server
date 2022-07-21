let teamRoom = {};
let waitingList = [];

function isExist(gitId) {
  if (gitId in teamRoom) {
    return true;
  } else {
    return false;
  }
}

function getRoom(gitId) {
  if (isExist(gitId)) {
    return teamRoom[gitId]
  }
}

async function getId(bangjang) {
  const room = await getRoom(bangjang)
  return room.id
}

function deleteId(bangjang) {
  delete teamRoom[bangjang];
}

function setPlayers(bangjang, players) {
  teamRoom[bangjang].players = players;
}

function addPlayer(bangjang, userInfo) {
  teamRoom[bangjang].players.push({ userInfo, peerId: '' });
}

function addToWaitingList(bangjang) {
  waitingList.push(bangjang);
}

function popFromWaitingList() {
  const bangjang = waitingList[0];
  waitingList = [];
  return bangjang;
}

module.exports = {
  isExist,
  getRoom,
  getId,
  deleteId,
  setPlayers,
  addPlayer,
  addToWaitingList,
  popFromWaitingList
}