const Interval = require('./interval');

let idx = 0;
const room = {};
const prevRoom = {};
const waitIdices = new Set();
/* room status: waiting, playing, full */

function getRoom(socket) {
  const rooms = socket.rooms;
  // console.log("getRoom", rooms.filter((room) => room != socket.id));
  for (const room of rooms) {
    if (room !== socket.id) {
      return room;
    }
  }
}

function setRoom(roomInfo) {
  if (roomInfo) {
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
}

function deletePlayer(socket, userName, delay) {
  try {
    const myRoom = getRoom(socket);
    if (myRoom !== undefined) {
      const idx = myRoom.slice(4);
      room[idx].players = room[idx].players.filter(item => item.gitId !== userName);
  
      if (room[idx].players.length === 0) {
        if (room[idx].status === 'waiting') Interval.deleteInterval(myRoom, 'wait');
        else if (room[idx].status === 'playing') Interval.deleteInterval(myRoom, 'solo');
        if (delay === undefined) delete room[idx];
        
        waitIdices.delete(idx);
      }
    }

  } catch(e) {
    console.log(`[deletePlayer][ERROR] :::: log: ${e}`);
  }
}

function filterRoom(idx) {
  const temp = new Set()
  try {
    const unique = room[idx].filter(item => {
      const alreadyHas = temp.has(item.players.gitId)
      temp.add(item.players.gitId)
      return !alreadyHas
    });
  } catch (e) {
    console.log(`[filterRoom][ERROR] :::: log: ${e}`);
  }
  setRoom(unique);
}

function joinRoom(userInfo) {
  try {
    room[idx].players.push(userInfo);
  }
  catch(e) {
    console.log(e);
  }
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

function getPrevRoom(gitId) {
  console.log('previous solo Room???: ', prevRoom);
  return prevRoom[gitId];
}

function setPrevRoom(socket) {
  prevRoom[socket.gitId] = getRoom(socket);
}

function deletePrevRoom(gitId) {
  if (prevRoom[gitId] !== undefined) {
    delete prevRoom[gitId];
  }
}


module.exports = {
  room,
  waitIdices,
	getRoom,
  setRoom,
  getStatus,
  setStatus,
  deletePlayer,
  createRoom,
  filterRoom,
  joinRoom,
	increaseIdx,
  getIdx,
  getPrevRoom,
  setPrevRoom,
  deletePrevRoom,
  prevRoom
};