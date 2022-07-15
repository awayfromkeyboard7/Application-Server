let idx = 0;
const room = [];

function getRoom(socket) {
  const rooms = socket.rooms;
  console.log(rooms);
  for (let i of rooms) {
    if (i !== socket.id) {
      return i;
    }
  }
}

function createRoom(userInfo) {
  if (userInfo) {
    room.push([userInfo]);
  } else {
    room.push([]);
  }
}

function joinRoom(userInfo) {
  console.log('joinRoom>>>>>>', userInfo, idx);
  room[idx].push(userInfo);
}

function setRoom(roomInfo) {
  if (roomInfo) {
    console.log('setRoom>>>>>', roomInfo);
    room[idx] = roomInfo;
  }
}

function increaseIdx() {
  idx += 1;
}

function getIdx() {
  return idx;
}

module.exports = {
  room,
	getRoom,
  setRoom,
  createRoom,
  joinRoom,
	increaseIdx,
  getIdx
};