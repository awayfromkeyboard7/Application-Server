const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./lib/db");
const app = express();
const User = require("./models/user");
const UserSocket = require("./models/usersocket");
const GameLog = require("./models/gamelog");
const GameRoom = require("./models/gameroom");
const Interval = require("./models/interval");
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

let waitingList = [];

let chatLogs = {};

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

  socket.onAny(e => console.log(`SOCKET EVENT::::::${e}`));

  socket.on("setGitId", async (gitId) => {
    if (gitId !== null) {
      console.log("setGitId >>>>>>>> gitId: ", gitId);
      // 소켓
      UserSocket.setSocketId(gitId, socket.id);
      socket.gitId = gitId;

      const followerList = await User.getFollowerListWithGitId(socket.gitId);
      await Promise.all (followerList.filter(friend => {
        if (UserSocket.isExist(friend)) {
          socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", socket.gitId);
        }
      }))
    }
    if (!(gitId in chatLogs)) {
      chatLogs[gitId] = {};
    }
    console.log("usersSocketId>>>", UserSocket.getSocketArray());
    console.log("users initial chatLogs", gitId, chatLogs);
  });

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

  SocketRoutes.solo.waitGame(socket, SocketRoutes.solo.event.waitGame);
  SocketRoutes.solo.startGame(socket, SocketRoutes.solo.event.startGame);
  SocketRoutes.solo.submitCode(socket, SocketRoutes.solo.event.submitCode);
  SocketRoutes.solo.getRanking(socket, SocketRoutes.solo.event.getRanking);
  SocketRoutes.solo.exitWait(socket, SocketRoutes.solo.event.exitWait);

  socket.on("createTeam", (userInfo) => {
    // console.log("createTeam........");
    if (!(userInfo.gitId in teamRoom)) {
      const teamRoomId = uuid.v4();
      socket.join(teamRoomId);
      // teamRoom[userInfo.gitId] = { id: teamRoomId, players: [userInfo] };
      teamRoom[userInfo.gitId] = { id: teamRoomId, players: [{userInfo, peerId:''}] };
      // 퍼플
      // socket.emit("enterNewUserToTeam", teamRoom[userInfo.gitId].players);
      socket.emit("enterNewUserToTeam", getPlayers(teamRoom[userInfo.gitId]));

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
    // console.log(userInfo.gitId, socket.rooms);
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
        // create gamelog for 2 teams.......
        
        // TODO1 양 팀의 유저들로 새 게임로그 생성
        const gameLogId = await gamelog.createTeamLog(getPlayers(teamRoom[waitingList[0]]), getPlayers(teamRoom[roomId]), teamRoom[waitingList[0]].id, teamRoom[roomId].id);
        User.addGameLog(await GameLog.getLog(gameLogId));
        
        // TODO2 client에서 teamGameStart 이벤트　on
        socket.nsp.to(teamRoom[waitingList[0]].id).emit("teamGameStart", waitingList[0], gameLogId);
        socket.nsp.to(teamRoom[roomId].id).emit("teamGameStart", roomId, gameLogId);
        let timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 15);
        const firstTeamId = teamRoom[waitingList[0]].id;
        const secondTeamId = teamRoom[roomId].id;
        Interval.makeInterval(socket, [firstTeamId,secondTeamId], timeLimit, "team")
        console.log("is it same???!@#!@#!@#!@#",[firstTeamId,secondTeamId])
        waitingList = [];
      }
     } else {
      console.log("teamgame should not be started yet!!!!!!!!");
      waitingList.push(roomId);
    }
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

  // 팀전 결과 화면 랭킹
  socket.on("getTeamRanking", async (gameLogId) => {

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
    socket.nsp.to(gameLog["roomIdA"]).to(gameLog["roomIdB"]).emit("getTeamRanking", result, gameLog["startAt"]);
    // 팀 랭킹 확인 후 자동으로 룸에서 나가야 함
    console.log("userLeft", gameLog["totalUsers"]);
    if (gameLog["totalUsers"] === -1) {
      socket.leaveAll();
      socket.join(socket.id)
    }
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

  socket.on("getTeamRanking", async (gameLogId) => {
    console.log("getTeamRanking", gameLogId);

    let gameLog = await GameLog.getLog(gameLogId);
    result = [gameLog["teamA"],gameLog["teamB"]];
    console.log("teamgame log info!!!!!!!", result);
    result.sort((a, b) => {
      if (a[0].passRate === b[0].passRate) {
        return a[0].submitAt - b[0].submitAt;
      } else {
        return b[0].passRate - a[0].passRate;
      }
    });
    socket.nsp.to(gameLog["roomIdA"]).to(gameLog["roomIdB"]).emit("getTeamRanking", result, gameLog["startAt"]);
  });

  socket.on("setPeerId", (userId, peerId, roomId) => {
    setPeerId(teamRoom[roomId], userId, peerId);
    console.log(teamRoom[roomId]);
    socket.broadcast.to(teamRoom[roomId].id).emit("getPeerId", userId, getPeerId(teamRoom[roomId]));
  });

  socket.on('sendChatMessage', (sender, receiver, message) => {
    console.log('send-message', message, UserSocket.getSocketId(receiver));

    if (chatLogs[sender][receiver] === undefined) {
      chatLogs[sender][receiver] = [message];
    } else {
      chatLogs[sender][receiver].push(message);
      if (chatLogs[sender][receiver].length > 30) {
        chatLogs[sender][receiver].shift();
      }
    }
    console.log(chatLogs[sender]);
    socket.to(UserSocket.getSocketId(receiver)).emit('sendChatMessage', message);
  });

  socket.on("getChatMessage", (sender, receiver) => {
    try {
      const senderToReceiver = chatLogs[sender][receiver] !== undefined ? chatLogs[sender][receiver] : [];
      const receverToSender = chatLogs[receiver][sender] !== undefined ? chatLogs[receiver][sender] : [];
  
      const myChatLogs = senderToReceiver.concat(receverToSender);
      myChatLogs.sort((a, b) => a.sendAt - b.sendAt);
      console.log('myChatLogs::::::::::');
      socket.emit("receiveChatMessage", myChatLogs);
    } catch(e) {
      console.log("getChatMessage ERROR >>>>>>> ", sender, receiver);
      console.log("getChatMessage ERROR >>>>>>> ", e);
    }
  });

  socket.on("unFollowMember", async (myNodeId, targetGitId) => {
    try {
      console.log(`unFollowMember >>>>>>>>>>>>>>>>> ${myNodeId} =====> ${targetGitId}`);
      await User.unfollow(myNodeId, targetGitId);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("followMember", async (myNodeId, targetGitId) => {
    try {
      console.log(`followMember >>>>>>>>>>>>>>>>> ${myNodeId} =====> ${targetGitId}`);
      await User.following(myNodeId, targetGitId);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("disconnecting", async () => {
    try {
      console.log("disconnecting usersSocketId >>>>>>>>>>>> ", UserSocket.getSocketArray())
      const followerList = await User.getFollowerListWithGitId(socket.gitId);
      console.log("disconnecting socket.gitId >>>>>>>> ", socket.gitId);
      UserSocket.deleteSocketId(socket.gitId)
      await Promise.all (followerList?.filter(friend => {
        if (UserSocket.isExist(friend)) {
          socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", socket.gitId);
        }
      }))
    } catch (e) {
      console.log(e)
    }
  })

  socket.on("getRoomId", async () => {
    try {
      const myRoom = GameRoom.getRoom(socket);
      socket.emit('getRoomId', myRoom);
    } catch (e) {
      console.log(e)
    }
  })

  socket.on("getFollowingList", async (nodeId) => {
    const followingList = await User.getFollowingList(nodeId);
    const result = await Promise.all (followingList.filter(friend => {
      if (UserSocket.isExist(friend.gitId)) {
        return friend
      }
    }))
    socket.emit("getFollowingList", result);
  })
});


server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});
