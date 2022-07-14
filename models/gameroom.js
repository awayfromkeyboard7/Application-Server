let idx = 0;
const room = [];

function getRoom(socket) {
  const rooms = socket.rooms;
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
  room[idx].push(userInfo);
}

function setRoom(roomInfo) {
  console.log('setRoom>>>>>', roomInfo);
  room[idx] = roomInfo;
}

function increaseIdx() {
  idx += 1;
  console.log('increaseIdx>>>>', idx);
}

module.exports = {
  idx,
  room,
	getRoom,
  setRoom,
  createRoom,
  joinRoom,
	increaseIdx
};