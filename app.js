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
    } else if (room[idx].length < 3) {
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
    io.in(myRoom).emit('submitCode', submitInfo)
  })

  socket.on('getRanking', async (gameLogId) => {
    const myRoom = await getRoom(socket);
    let info = await GameLog.getLog(gameLogId);

    // https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
    info['userHistory'].sort((a, b) => {
      if (a.passRate === b.passRate) {
        return a.submitAt - b.submitAt
      } else {
        return b.passRate - a.passRate
      }
    })

    io.in(myRoom).emit('getRanking', info['userHistory'], info['startAt']);
  })

  socket.on('exitWait', async (userName) => {
    let myRoom = await getRoom(socket);
    const myRealRoom = myRoom;
    const idx = Number(myRoom?.replace('room', ''))
    console.log('exitWait >>>>>>', userName, myRoom, idx)
    room[idx] = room[idx].filter(item => item.gitId !== userName);
    socket.to(myRealRoom).emit('exitWait', room[idx])
  })

  socket.on('disconnecting', () => {
    console.log('user disconnecting');
  })
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`)
})