const http = require("http");
const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");

const db = require("./lib/db");

const User = require("./models/user");
const UserSocket = require("./models/usersocket");
const Chat = require("./models/chat");
const GameLog = require("./models/gamelog");
const GameRoom = require("./models/gameroom");
const teamGameRoom = require("./models/teamroom");
const Interval = require("./models/interval");
const SocketRoutes = require("./socketRoutes");
const gamelog = require("./models/gamelog");

const app = express();
const SocketIO = require("socket.io");
const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

const PORTNUM = 3000;

// https://m.blog.naver.com/psj9102/221282415870
db.connect();
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use("/", require("./routes/"));

let teamRoom = {};
let waitingList = [];

function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

function getPlayers(arr) {
  const temp = [];
  for (const info of arr.players) {
    temp.push(info.userInfo);
  }
  return temp;
} 

function maygetPlayers(arr) {
  const temp = [];
  for (const info of arr?.players) {
    temp.push(info.userInfo);
  }
  return temp;
} 

function getPeerId(arr) {
  const temp = {};
  for (const info of arr.players) {
    temp[info.userInfo.gitId] = info.peerId;
  }
  return temp;
}

function setPeerId(arr, gitId, peerId) {
  for (const info of arr.players) {
    if (info.userInfo.gitId === gitId) {
      info.peerId = peerId;
      return
    }
  }
} 

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`, teamRoom);

  socket.onAny(e => {
    console.log(`SOCKET EVENT::::::${e}`);
  });

  SocketRoutes.solo.waitGame(socket, SocketRoutes.solo.event.waitGame);
  SocketRoutes.solo.startGame(socket, SocketRoutes.solo.event.startGame);
  SocketRoutes.solo.submitCode(socket, SocketRoutes.solo.event.submitCode);
  SocketRoutes.solo.getRanking(socket, SocketRoutes.solo.event.getRanking);

  // Team
  SocketRoutes.team.getTeamRanking(socket, SocketRoutes.team.event.getTeamRanking);

  // Follow
  SocketRoutes.follow.followMember(socket, SocketRoutes.follow.event.followMember);
  SocketRoutes.follow.getFollowingList(socket, SocketRoutes.follow.event.getFollowingList);
  SocketRoutes.follow.unFollowMember(socket, SocketRoutes.follow.event.unFollowMember);
  
  // Connection
  SocketRoutes.connection.setGitId(socket, SocketRoutes.connection.event.setGitId);
  SocketRoutes.connection.disconnecting(socket, SocketRoutes.connection.event.disconnecting);

  // Chat
  SocketRoutes.chat.sendChatMessage(socket, SocketRoutes.chat.event.sendChatMessage);
  SocketRoutes.chat.getChatMessage(socket, SocketRoutes.chat.event.getChatMessage);

  socket.on("exitWait", async (gitId) => {
    console.log("exitWait roomId >>>>>>>>>>>>>> ", socket.bangjang);
    let myRoom = await GameRoom.getRoom(socket);
    GameRoom.setRoom(GameRoom.room[GameRoom.getIdx()]?.filter((item) => item.gitId !== gitId));
    try {
      if (gitId in teamRoom) {
        socket.nsp.to(teamRoom[gitId].id).emit("exitTeamGame", gitId);
        delete teamRoom[gitId]
      } else {
        if (socket.bangjang !== undefined) {
          teamRoom[socket.bangjang].players = teamRoom[socket.bangjang].players.filter(player => {
            return player.userInfo.gitId !== gitId
          })
          socket.to(teamRoom[socket.bangjang].id).emit("enterNewUserToTeam", getPlayers(teamRoom[socket.bangjang]))
          socket.bangjang = undefined
        } else {
          socket.to(myRoom).emit("exitWait", GameRoom.room[GameRoom.getIdx()]);
        }
      }
      // 모든방에서 나가진 후 자기 private room 입장
      socket.leaveAll();
      socket.join(socket.id);
    } catch(e) {
      console.log(`exitWait ERROR ::::::: gitId: ${gitId}`);
      console.log(`exitWait ERROR ::::::: log: ${e}`);
    }
  });

  socket.on("getGitIdFromNodeId", async (nodeId) => {
    console.log(nodeId);
    const curId = await User.getUserInfoWithNodeId(nodeId);
    // console.log("gitID????", curId);
  })
  socket.on("createTeam", (userInfo) => {
    // console.log("createTeam........");
    if (!(userInfo.gitId in teamRoom)) {
      const teamRoomId = uuid.v4();
      socket.join(teamRoomId);
      // teamRoom[userInfo.gitId] = { id: teamRoomId, players: [userInfo] };
      teamRoom[userInfo.gitId] = { id: teamRoomId, players: [{userInfo, peerId:''}] };
      // 퍼플
      // socket.emit("enterNewUserToTeam", teamRoom[userInfo.gitId].players);
      // socket.emit("enterNewUserToTeam", getPlayers(teamRoom[userInfo.gitId]));

      // 팀생성 인터벌 도현 주석
      // let timeLimit = new Date();
      // timeLimit.setMinutes(timeLimit.getMinutes() + 3);
  
      return () => {
        clearInterval(interval);
      };
    }
    else {
      socket.join(teamRoom[userInfo.gitId].id);
    }
  });

  socket.on("inviteMember", (gitId, friendGitId) => {
    console.log(`InviteMember >>>>>>>> ${gitId} => ${friendGitId}`)
    socket.to(UserSocket.getSocketId(friendGitId)).emit("comeon", gitId);
  });

  socket.on("acceptInvite", (roomId, userInfo) => {
    teamRoom[roomId].players.push({userInfo, peerId:''});
    
    const temp = new Set();
    const unique = teamRoom[roomId].players.filter((item) => {
      const alreadyHas = temp.has(item.userInfo.gitId);
      temp.add(item.userInfo.gitId);
      return !alreadyHas;
    });
    
    teamRoom[roomId].players = unique;

    socket.join(teamRoom[roomId].id);
    socket.nsp
      .to(teamRoom[roomId].id)
      .emit("enterNewUserToTeam", getPlayers(teamRoom[roomId]));
    
    socket.bangjang = roomId;
    console.log(teamRoom);
  });

  socket.on('getUsers', (roomId) => {
    socket.join(teamRoom[roomId].id);
    socket.emit('setUsers', maygetPlayers(teamRoom[roomId]));
  });

  socket.on("goToMachingRoom", async (userId) => {
    // userId가 방장인 경우만 emit
    // console.log("goToMachingRoom>>>>>!>!!>!>!>!>!!", userId, teamRoom)
    // console.log(userId, teamRoom, socket.rooms);
    if (userId in teamRoom) {
      socket.nsp.to(teamRoom[userId].id).emit("goToMachingRoom", userId);
    }
  })

  // 팀전 매칭 버튼을 누르면 waiting리스트 확인 후 대기자가 있으면 게임 시작, 없으면 대기리스트에 추가
  socket.on("startMatching", async (roomId) => {
    socket.join(teamRoom[roomId].id);
    // console.log(socket.rooms);
    // 팀전 매칭을 누르면 team room에 있는 인원 모두 매칭룸으로 이동
    if (waitingList.length === 1) {
      // 새로고침하면 이미 내가 대기리스트에 있는 상태.
      if (!(waitingList.includes(roomId))) {
        const gameLogId = await gamelog.createTeamLog(getPlayers(teamRoom[waitingList[0]]), getPlayers(teamRoom[roomId]), teamRoom[waitingList[0]].id, teamRoom[roomId].id);
        User.addGameLog(await GameLog.getLog(gameLogId));
        let timeLimit = new Date();
        timeLimit.setSeconds(timeLimit.getSeconds() + 5);
        const firstTeamId = teamRoom[waitingList[0]].id;
        const secondTeamId = teamRoom[roomId].id;

        const interval = setInterval(() => {
          socket.nsp.to([firstTeamId,secondTeamId]).emit("timeLimitCode", timeLimit - new Date());
          if(timeLimit < new Date()) {
            clearInterval(interval);
          }

        }, 1000);

        setTimeout(() => {
          timeLimit = new Date();
          timeLimit.setMinutes(timeLimit.getMinutes() + 15);

          // create gamelog for 2 teams.......
          
          // TODO1 양 팀의 유저들로 새 게임로그 생성
          // TODO2 client에서 teamGameStart 이벤트　on
          socket.nsp.to(teamRoom[waitingList[0]].id).emit("teamGameStart", waitingList[0], gameLogId);
          socket.nsp.to(teamRoom[roomId].id).emit("teamGameStart", roomId, gameLogId);
          
          Interval.makeInterval(socket, [firstTeamId,secondTeamId], timeLimit, "team")
          waitingList = [];

        }, 5001);
          // console.log("is it same???!@#!@#!@#!@#",[firstTeamId,secondTeamId])
      }
     } else {
      console.log("teamgame should not be started yet!!!!!!!!");
      waitingList.push(roomId);
    }
    // console.log("startMatching", roomId, waitingList);
  });

  //팀전에서 게임 제출
  socket.on("submitCodeTeam", async (gameLogId, bangjang) => {
    // console.log("submitCodeTeam", bangjang, gameLogId);

    let gameLog = await GameLog.getLog(gameLogId);
    // console.log("teamgame log info!!!!!!!", info);
    result = [gameLog["teamA"],gameLog["teamB"]];
    // console.log(result)
    result.sort((a, b) => {
      if (a[0].passRate === b[0].passRate) {
        return a[0].submitAt - b[0].submitAt;
      } else {
        return b[0].passRate - a[0].passRate;
      }
    });
    socket.nsp.to(gameLog["roomIdA"]).to(gameLog["roomIdB"]).emit("submitCodeTeam", result);
    console.log(gameLog["roomIdA"], teamRoom[bangjang].id);
    socket.nsp.to(teamRoom[bangjang].id).emit("teamGameOver");
  });

  socket.on("getTeamInfo", (roomId) => {
    // console.log('get game info >>>>> ', roomId, maygetPlayers(teamRoom[roomId]));
    socket.join(teamRoom[roomId].id);
    socket.emit("getTeamInfo", maygetPlayers(teamRoom[roomId]));
  });
  
  socket.on("shareJudgedCode", (data, bangjang) => {
    console.log(data, bangjang)
    socket.to(teamRoom[bangjang].id).emit("shareJudgedCode", data);
  });

  socket.on("setPeerId", (userId, peerId, roomId) => {
    setPeerId(teamRoom[roomId], userId, peerId);
    console.log(teamRoom[roomId]);
    socket.broadcast.to(teamRoom[roomId].id).emit("getPeerId", userId, getPeerId(teamRoom[roomId]));
  });

  socket.on("getRoomId", async () => {
    try {
      const myRoom = GameRoom.getRoom(socket);
      socket.emit('getRoomId', myRoom);
    } catch (e) {
      console.log(e)
    }
  })
});


server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});
