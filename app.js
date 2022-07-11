const http = require("http");
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./lib/db');
const app = express();
const User = require('./models/user');

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

io.on("connection", socket => {
  console.log(`user connected: ${socket.id}`)
  
  socket.on('message', data => {
    console.log('socket >> message ', data);
  })

  socket.on('waitGame', (userInfo, done) => {
    
    if (waiting == 0) {
      room.push([userInfo]);
      socket.join(`room${idx}`)
      waiting += 1;
    } else if (waiting < 2) {
      waiting += 1;
      room[idx].push(userInfo);
      socket.join(`room${idx}`);
    } else {
      waiting = 1;
      idx += 1
      room.push([userInfo]);
      socket.join(`room${idx}`);
    }

    socket.nsp.to(`room${idx}`).emit('enterNewUser', room[idx])

    console.log('socket >> userName ', userInfo.uname);
  })

  socket.on('startGame', () => {
    const rooms = socket.rooms;
    // let result;
    for(let i of rooms) {
      if(i !== socket.id) {
        socket.nsp.to(i).emit('startGame')
      }
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnected');
  })
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`)
})