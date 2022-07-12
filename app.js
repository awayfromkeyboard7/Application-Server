const http = require("http");
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./lib/db');
const app = express();
const User = require('./models/user');
const GameLog = require('./models/gamelog');

const SocketIO = require("socket.io");
const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"]
  }
});

const PORTNUM = 3000;

// https://m.blog.naver.com/psj9102/221282415870
db.connect();
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json());
app.use('/', require('./routes/'));

let waiting = 0;
let idx = 0;
let room = [];

function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

function getRoom(socket) {
  const rooms = socket.rooms;
  for(let i of rooms) {
    if(i !== socket.id) {
      return i
    }
  }
}

io.on("connection", socket => {
  console.log(`user connected: ${socket.id}`)
  
  socket.on('message', data => {
    console.log('socket >> message ', data);
  })

  socket.on('waitGame', (userInfo, done) => {
    console.log(userInfo)
    if (room.length == 0) {
      room.push([userInfo]);
      socket.join(`room${idx}`)
    } else if (room[idx].length < 2) {
      room[idx].push(userInfo)
      const temp = new Set()
      const unique = room[idx].filter(item => {
        const alreadyHas = temp.has(item.gitId)
        temp.add(item.gitId)
        return !alreadyHas
      })
      room[idx] = unique
      socket.join(`room${idx}`);
    } else {
      idx += 1
      room.push([userInfo]);
      socket.join(`room${idx}`);
    }
    socket.nsp.to(`room${idx}`).emit('enterNewUser', room[idx])
  })

  socket.on('startGame', (gameLogId) => {
    const rooms = socket.rooms;
    for(let i of rooms) {
      if(i !== socket.id) {
        socket.nsp.to(i).emit('startGame', gameLogId)
      }
    }
  })

  socket.on('submitCode', (submitInfo) => { 
    const myRoom = getRoom(socket);
    socket.nsp.to(myRoom).emit('submitCode', submitInfo)
  })

  socket.on('getRanking', async (gameLogId) => {
    const myRoom = await getRoom(socket);
    let info = await GameLog.getLog(gameLogId);
    socket.nsp.to(myRoom).emit('getRanking', info['userHistory']);
  })

  socket.on('exitWait', async (userName) => {

    console.log('exitWait: ', userName);
    let myRoom = await getRoom(socket);
    const myRealRoom = myRoom;
    const idx = Number(myRoom?.replace('room', ''))
    console.log('exitWait >>>>>>', myRoom, idx)
    room[idx] = room[idx].filter(item => item.gitId !== userName);
    console.log('exitWait: ', room[idx]);
    socket.to(myRealRoom).emit('exitWait', room[idx])
  })
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`)
})