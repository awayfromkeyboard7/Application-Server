const Interval = require('./interval');

let idx = 0;
const room = {};
const waitIdices = new Set();

/* room status: waiting, playing, full */

function getRoom(socket) {
  const rooms = socket.rooms;
  // console.log("getRoom", rooms.filter((room) => room != socket.id));
  for (let i of rooms) {
    if (i !== socket.id) {
      return i;
    }
  }
}

function setRoom(roomInfo) {
  if (roomInfo) {
    console.log('setRoom>>>>>', roomInfo);
    room[idx].players = roomInfo;
  }
}

function createRoom(userInfo) {
  if (room[idx]?.status === 'playing') {
    idx++;
  }
  room[idx] = {
    players: [userInfo],
    status: 'waiting'
  }
  waitIdices.add(idx);
  console.log('roomCreated>>>>>>', JSON.stringify(room));
  // if (userinfo)
  // if (userInfo) {
  //   room.push([userInfo]);
  // } else {
  //   room.push([]);
  // }
}

function deleteUser(socket, userName) {
  try {
    const myRoom = getRoom(socket);
    if (myRoom !== undefined) {
      const idx = myRoom[4];
      room[idx].players = room[idx].players.filter(item => item.gitId !== userName);
  
      if (room[idx].players.length === 0) {
        // if (room[idx].status === 'waiting') Interval.deleteInterval(myRoom, 'wait');
        // else if (room[idx].status === 'playing') Interval.deleteInterval(myRoom, 'solo');
        delete room[idx];
        waitIdices.delete(idx);
      }
      console.log("DELETED ROOM!!!!!!",room);
    }

  } catch(e) {
    console.log(e);
  }
}

function filterRoom(idx) {
  const temp = new Set()
  const unique = GameRoom.room[idx].filter(item => {
    const alreadyHas = temp.has(item.players.gitId)
    temp.add(item.players.gitId)
    return !alreadyHas
  });
  GameRoom.setRoom(unique);
}

function joinRoom(userInfo) {
  console.log('joinRoom>>>>>>', userInfo, idx);
  try {
    room[idx].players.push(userInfo);
  }
  catch(e) {
    console.log(e);
  }
  console.log('playerJoined>>>>>>', room);
}


function getStatus(idx) {
  return room[idx].status;
}


function setStatus(idx, status) {
  room[idx].status = status;
}

function increaseIdx() {
  idx += 1;
  return idx;
}

function getIdx() {
  return idx;
}

module.exports = {
  room,
  waitIdices,
	getRoom,
  setRoom,
  getStatus,
  setStatus,
  deleteUser,
  createRoom,
  filterRoom,
  joinRoom,
	increaseIdx,
  getIdx
};