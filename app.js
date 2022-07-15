const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./lib/db");
const app = express();
const User = require("./models/user");
const GameLog = require("./models/gamelog");
const GameRoom = require("./models/gameroom")
const uuid = require('uuid');

const SocketIO = require("socket.io");
const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});
const SocketRoutes = require("./socketRoutes");

const PORTNUM = 3000;

// https://m.blog.naver.com/psj9102/221282415870
db.connect();
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use("/", require("./routes/"));

let teamRoom = {}
// user들의 socket Id
let usersSocketId = {}

// {
//   'Son0-0' : {
//     room: dsfklsdjflksjflksdjflksdjf,
//     user: [Son0-0, park-hg, ...]
//   }
// }



io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on('setGitId', gitId => {
    // socket["gitId"] = gitId;
    // if (gitId) {
      // socket.on('setGitId')
    usersSocketId[gitId] = socket.id;
    console.log('usersSocketId>>>', usersSocketId)
    // }
  })

  SocketRoutes.waitGame(socket, SocketRoutes.event.waitGame);
  SocketRoutes.startGame(socket, SocketRoutes.event.startGame);
  SocketRoutes.submitCode(socket, SocketRoutes.event.submitCode);
  SocketRoutes.getRanking(socket, SocketRoutes.event.getRanking);
  SocketRoutes.exitWait(socket, SocketRoutes.event.exitWait);

  // socket.on("disconnecting", () => {
  //   console.log("user disconnecting");
  // });

  socket.on('createTeam', (userInfo) => {
    console.log('createTeam........');
    const teamRoomId = uuid.v4();
    socket.join(teamRoomId);
    teamRoom[teamRoomId] = [userInfo];
    console.log('teamRoom>>>>', teamRoomId)
    socket.teamRoomId = teamRoomId;
    console.log("socketid: ", socket.id);
    console.log("socket: ", socket);
    // 퍼플
    socket.emit('enterNewUserToTeam', teamRoom[teamRoomId]);
    }
  )

  socket.on("setTeamRoomId", (teamRoomId) => {
    console.log("setTeamRoomIdsetTeamRoomIdsetTeamRoomId")
    socket["teamRoomId"] = teamRoomId;
  })

  socket.on('inviteMember', (roomId, friendGitId) => {
    console.log('inviteMember roomId>>>>>', roomId, friendGitId);
    socket.to(usersSocketId[friendGitId]).emit('comeon', roomId);
    // to.join(from.teamRoomId)
    // socket.emit('inviteMember', to);
    // socket.emit('enterNewUserToTeam', teamRoom[from.id]);
    }
  )

  socket.on('acceptInvite', (roomId, userInfo) => {
    // to.join(from.teamRoomId)
    // socket.emit('inviteMember', to);
    // socket.emit('enterNewUserToTeam', teamRoom[from.id]);
    teamRoom[roomId].push(userInfo)
    socket.join(roomId);
    socket.emit('enterNewUserToTeam', teamRoom[roomId]);
    }
  )
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});