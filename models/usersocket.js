// user들의 socket Id
const usersSocketId = {};

function setSocketId (gitId, socketId) {
  usersSocketId[gitId] = socketId;
}

function getSocketId (gitId) {
  if (gitId in usersSocketId) {
    return usersSocketId[gitId];
  } else {
    return null;
  }
}

function deleteSocketId (gitId) {
  try {
    delete usersSocketId[gitId]
  } catch {
    console.log("UserSocket deleteSocketId :::::::: ", gitId);
  }
}

function isExist (gitId) {
  if (gitId in usersSocketId) {
    return true;
  }
  return false;
}

function getSocketArray () {
  return usersSocketId;
}

module.exports = {
  usersSocketId,
  setSocketId,
  getSocketId,
  deleteSocketId,
  isExist,
  getSocketArray,
}

