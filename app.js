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

function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}


io.on("connection", (socket) => {
  // console.log(`user connected: ${socket.id}`);
  socket.onAny(e => console.log(`SOCKET EVENT::::::${e}`));

  socket.on("setGitId", (gitId) => {
    usersSocketId[gitId] = socket.id;
    // console.log("usersSocketId>>>", usersSocketId);
  });

  SocketRoutes.waitGame(socket, SocketRoutes.event.waitGame);
  SocketRoutes.startGame(socket, SocketRoutes.event.startGame);
  SocketRoutes.submitCode(socket, SocketRoutes.event.submitCode);
  SocketRoutes.getRanking(socket, SocketRoutes.event.getRanking);
  SocketRoutes.exitWait(socket, SocketRoutes.event.exitWait);

  socket.on("createTeam", (userInfo) => {
    // console.log("createTeam........");
    const teamRoomId = uuid.v4();
    socket.join(teamRoomId);
    teamRoom[userInfo.gitId] = { id: teamRoomId, players: [userInfo] };
    // 퍼플
    socket.emit("enterNewUserToTeam", teamRoom[userInfo.gitId].players);

    let timeLimit = new Date();
    timeLimit.setMinutes(timeLimit.getMinutes() + 3);
  
    const interval = setInterval(() => {
      socket.nsp.to(teamRoom[userInfo.gitId].id).emit("timeLimit", timeLimit - new Date());
      if(timeLimit < new Date()) {
        socket.nsp.to(teamRoom[userInfo.gitId].id).emit("timeOut");
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  socket.on("inviteMember", (gitId, friendGitId) => {
    console.log(`InviteMember >>>>>>>> ${gitId} => ${friendGitId}`)
    socket.to(usersSocketId[friendGitId]).emit("comeon", gitId);
  });

  socket.on("acceptInvite", (roomId, userInfo) => {
    // console.log(`acceptInvite >>>>>>>> ${roomId} => ${userInfo.gitId}`)

    teamRoom[roomId].players.push(userInfo);

    // console.log('teamRoom[roomId]', teamRoom[roomId])

    const temp = new Set();
    const unique = teamRoom[roomId].players.filter((item) => {
      const alreadyHas = temp.has(item.gitId);
      temp.add(item.gitId);
      return !alreadyHas;
    });
    teamRoom[roomId].players = unique;
    
    socket.join(teamRoom[roomId].id);
    socket.nsp
      .to(teamRoom[roomId].id)
      .emit("enterNewUserToTeam", teamRoom[roomId].players);
    
    console.log(teamRoom);

  });

  socket.on('getUsers', (roomId) => {
    socket.emit('setUsers', teamRoom[roomId]?.players);
  });




 
  socket.on("goToMachingRoom", async (roomId) => {
    socket.nsp.to(teamRoom[roomId]?.id).emit("goToMachingRoom", teamRoom[roomId]?.players[0]['gitId']);
  })

  // 팀전 매칭 버튼을 누르면 waiting리스트 확인 후 대기자가 있으면 게임 시작, 없으면 대기리스트에 추가
  socket.on("startMatching", async (roomId) => {
    // console.log(teamRoom[roomId]);
    console.log(waitingList);
    // 팀전 매칭을 누르면 team room에 있는 인원 모두 매칭룸으로 이동
    // console.log("startMatching", roomId, waitingList);
    if (waitingList.length === 1) {

      // create gamelog for 2 teams.......
      // TODO1 양 팀의 유저들로 새 게임로그 생성
      const gameLogId = await gamelog.createTeamLog(teamRoom[waitingList[0]].players, teamRoom[roomId].players, teamRoom[waitingList[0]].id, teamRoom[roomId].id);

      // TODO2 client에서 teamGameStart 이벤트　on
      socket.nsp.to(teamRoom[waitingList[0]].id).emit("teamGameStart", teamRoom[waitingList[0]].id, gameLogId);
      socket.nsp.to(teamRoom[roomId].id).emit("teamGameStart", teamRoom[roomId].id, gameLogId);
      waitingList = [];
    } else {
      console.log("teamgame should not be started yet!!!!!!!!");
      waitingList.push(roomId);
    }
    // console.log("startMatching", roomId, waitingList);
  });

  socket.on("exitTeamGame", async (bangjang, user) => {
    console.log("WHO CALLED exitTeamGame????????? roomId: ", bangjang, user);

    // 만약 메인으로 버튼을 누른 사람이 방장이면 모두다 메인으로
    if (bangjang === user) {
      console.log(">>>>>> socket.rooms before EXIT >>>>>>>", socket.rooms, teamRoom[bangjang].id);
      console.log(">>>>>> waitingList before EXIT >>>>>>>", waitingList, bangjang);
      console.log(">>>>>> teamRoom before EXIT >>>>>>>", teamRoom, bangjang);
  
      socket.nsp.to(teamRoom[bangjang].id).emit("exitTeamGame");
      socket.leave(teamRoom[bangjang].id);
  
      waitingList = arrayRemove(waitingList, bangjang);
      delete teamRoom[bangjang]
      console.log(">>>>>> socket.rooms before EXIT >>>>>>>", socket.rooms);
      console.log(">>>>>> waitingList after EXIT >>>>>>>", waitingList);
  
      // BUG: WHY annie1229 is in TEAMROOM???????????????????
      // 혜진 캐리
      console.log(">>>>>> teamRoom after EXIT >>>>>>>", teamRoom);
    }

    // GameRoom.setRoom(GameRoom.room[GameRoom.getIdx()]?.filter((item) => item.gitId !== userName));
    // console.log(GameRoom.room[GameRoom.getIdx()]);
    // socket.leave(myRealRoom);
    // socket.to(myRealRoom).emit("exitWait", GameRoom.room[GameRoom.getIdx()]);
  });

  //팀전에서 게임 제출
  socket.on("SubmitCodeTeam", async (gameLogId) => {
    // if (info[mode] === "team" )
    let info = await GameLog.getLog(gameLogId);
    console.log("teamgame log info!!!!!!!", info);
    result = [info["TeamA"],info["TeamB"]];
    result.sort((a, b) => {
      if (a[0].passRate === b[0].passRate) {
        return a[0].submitAt - b[0].submitAt;
      } else {
        return b[0].passRate - a[0].passRate;
      }
    });
    console.log(info["roomIdA"], info["roomIdB"])
    socket.nsp.to(info["roomIdA"]).to(info["roomIdB"]).emit("SubmitCodeTeam", result);
    
  });

  socket.on("getTeamInfo", (roomId) => {
    console.log('get game info >>>>> ', roomId, teamRoom[roomId]?.players);
    socket.emit("getTeamInfo", teamRoom[roomId]?.players)
  })

});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});