const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./lib/db");
const app = express();
const User = require("./models/user");
const GameLog = require("./models/gamelog");
const GameRoom = require("./models/gameroom");
const uuid = require("uuid");

const SocketIO = require("socket.io");
const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});
const SocketRoutes = require("./socketRoutes");
const gamelog = require("./models/gamelog");

const PORTNUM = 3000;

// https://m.blog.naver.com/psj9102/221282415870
db.connect();
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use("/", require("./routes/"));

let teamRoom = {};
// user들의 socket Id
let usersSocketId = {};

let waitingList = [];

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.onAny(e => console.log(e));

  socket.on("setGitId", (gitId) => {
    usersSocketId[gitId] = socket.id;
    console.log("usersSocketId>>>", usersSocketId);
  });

  SocketRoutes.waitGame(socket, SocketRoutes.event.waitGame);
  SocketRoutes.startGame(socket, SocketRoutes.event.startGame);
  SocketRoutes.submitCode(socket, SocketRoutes.event.submitCode);
  SocketRoutes.getRanking(socket, SocketRoutes.event.getRanking);
  SocketRoutes.exitWait(socket, SocketRoutes.event.exitWait);

  socket.on("createTeam", (userInfo) => {
    console.log("createTeam........");
    const teamRoomId = uuid.v4();
    socket.join(teamRoomId);
    teamRoom[userInfo.gitId] = { id: teamRoomId, players: [userInfo] };
    // 퍼플
    socket.emit("enterNewUserToTeam", teamRoom[userInfo.gitId].players);
  });

  socket.on("inviteMember", (gitId, friendGitId) => {
    console.log(`InviteMember >>>>>>>> ${gitId} => ${friendGitId}`)
    socket.to(usersSocketId[friendGitId]).emit("comeon", gitId);
  });

  socket.on("acceptInvite", (roomId, userInfo) => {
    console.log(`acceptInvite >>>>>>>> ${roomId} => ${userInfo.gitId}`)

    teamRoom[roomId].players.push(userInfo);

    const temp = new Set()
    const unique = teamRoom[roomId].players.filter((item) => {
      const alreadyHas = temp.has(item.gitId);
      temp.add(item.gitId);
      return !alreadyHas;
    });
    teamRoom[roomId].players = unique
    
    socket.join(teamRoom[roomId].id);
    socket.nsp
      .to(teamRoom[roomId].id)
      .emit("enterNewUserToTeam", teamRoom[roomId].players);
  });

  // 게임 시작 버튼을 누르면 waiting리스트 확인 후 대기자가 있으면 게임 시작, 없으면 대기리스트에 추가
  socket.on("startMatching", async (roomId) => {
    console.log("startMatching", roomId, waitingList);
    if (waitingList.length === 1) {

      // create gamelog for 2 teams.......
      // TODO1 양 팀의 유저들로 새 게임로그 생성
      const gameLogId = await gamelog.createTeamLog(teamRoom[waitingList[0]].players, teamRoom[roomId].players);

      // TODO2 client에서 teamGameStart 이벤트　on
      socket.nsp.to(teamRoom[waitingList[0]].id).emit("teamGameStart", teamRoom[waitingList[0]].id, gameLogId);
      socket.nsp.to(teamRoom[roomId].id).emit("teamGameStart", teamRoom[roomId].id, gameLogId);
      waitingList = [];
    } else {
      console.log("teamgame should not be started yet!!!!!!!!");
      waitingList.push(roomId);
    }
    console.log("startMatching", roomId, waitingList);

  });
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});
