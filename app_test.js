const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./lib/db");
//도현 게임로그 추가
const mongoose = require('mongoose');
const User = require('./models/db/user');
const GameLog = require('./models/db/gamelog');
const Problem = require('./models/db/problem');
const Code = require('./models/db/code');
const UserHistory = require("./models/db/userHistory");
//

const SocketRoutes = require("./socketRoutes");

const app = express();
const SocketIO = require("socket.io");
const { findById } = require("./models/db/user");
const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: process.env.ORIGIN,
  },
});

const PORTNUM = 3000;

// https://m.blog.naver.com/psj9102/221282415870
db.connect();
app.use(cors({
  origin: process.env.ORIGIN,
  method: ["GET", "POST"],
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use("/", require("./routes/"));

io.on("connection", (socket) => {
  socket.onAny(e => {
    console.log(`SOCKET EVENT::::::${e}`);
  });

  // Connection
  SocketRoutes.connection.setGitId(socket, SocketRoutes.connection.event.setGitId);
  SocketRoutes.connection.disconnecting(socket, SocketRoutes.connection.event.disconnecting);
  SocketRoutes.connection.exitWait(socket, SocketRoutes.connection.event.exitWait);

  // Solo
  SocketRoutes.solo.waitGame(socket, SocketRoutes.solo.event.waitGame);
  SocketRoutes.solo.startGame(socket, SocketRoutes.solo.event.startGame);
  SocketRoutes.solo.submitCode(socket, SocketRoutes.solo.event.submitCode);
  SocketRoutes.solo.getRanking(socket, SocketRoutes.solo.event.getRanking);
  SocketRoutes.solo.getRoomId(socket, SocketRoutes.solo.event.getRoomId);

  // Team
  SocketRoutes.team.getTeamRanking(socket, SocketRoutes.team.event.getTeamRanking);
  SocketRoutes.team.createTeam(socket, SocketRoutes.team.event.createTeam);
  SocketRoutes.team.inviteMember(socket, SocketRoutes.team.event.inviteMember);
  SocketRoutes.team.acceptInvite(socket, SocketRoutes.team.event.acceptInvite);
  SocketRoutes.team.getUsers(socket, SocketRoutes.team.event.getUsers);
  SocketRoutes.team.startMatching(socket, SocketRoutes.team.event.startMatching);
  SocketRoutes.team.goToMatchingRoom(socket, SocketRoutes.team.event.goToMatchingRoom);
  SocketRoutes.team.submitCodeTeam(socket, SocketRoutes.team.event.submitCodeTeam);
  SocketRoutes.team.getTeamInfo(socket, SocketRoutes.team.event.getTeamInfo);
  SocketRoutes.team.shareJudgedCode(socket, SocketRoutes.team.event.shareJudgedCode);
  SocketRoutes.team.setPeerId(socket, SocketRoutes.team.event.setPeerId);

  // Follow
  SocketRoutes.follow.followMember(socket, SocketRoutes.follow.event.followMember);
  SocketRoutes.follow.getFollowingList(socket, SocketRoutes.follow.event.getFollowingList);
  SocketRoutes.follow.unFollowMember(socket, SocketRoutes.follow.event.unFollowMember);

  // Chat
  SocketRoutes.chat.sendChatMessage(socket, SocketRoutes.chat.event.sendChatMessage);
  SocketRoutes.chat.getChatMessage(socket, SocketRoutes.chat.event.getChatMessage);
  SocketRoutes.chat.getUnreadMessage(socket, SocketRoutes.chat.event.getUnreadMessage);
  SocketRoutes.chat.resetUnreadCount(socket, SocketRoutes.chat.event.resetUnreadCount);
});

async function makeGamelog(num){
  
  const userIds =[
    mongoose.Types.ObjectId('62e63483031a45c3d48b2b48'),
    mongoose.Types.ObjectId("62e63549e9f30931ffff50d8"),
    mongoose.Types.ObjectId("62e63bafb1fc530005d8588e"),
    mongoose.Types.ObjectId("62e63bceb1fc530005d8589e"),
    mongoose.Types.ObjectId("62e63f1953aa28ac756d5482"),
    mongoose.Types.ObjectId("62e63fd2fa0f2b1410364f30"),  
    mongoose.Types.ObjectId("62e6443ecd40acd595377678"),
    mongoose.Types.ObjectId("62e7c9c454f8dfc73c929e80"),
  ]
  const languages = ["Python","Python","Python","JavaScript","Python","Python","JavaScript","Python"]
  const codes = ["hello peter","hello lager","hello lager2", "33EilLagerAncan","hello son1","hello hg", "hello purple", "hello son0"]

  for (let i = 0; i<num; i++){
    let j = i%8
    let userHistory = []
    for (let k = 0; k<8; k++){
      let userInfo ={}
      let l = (k+j)%8
      console.log("showmellllllllllll",l)
      let user = await User.getUserInfo(userIds[l])
      let code = await Code.createCode(codes[l])
      userInfo["userId"] = userIds[l]
      userInfo["gitId"] = user["gitId"]
      userInfo["avatarUrl"] = user["avatarUrl"]
      userInfo["language"] = languages[l]
      userInfo["code"] = code["_id"]
      userInfo["ranking"] = k+1
      userInfo["passRate"] = 100-(k*10)
      userHistory.push(userInfo)
      console.log(userHistory)
    }
    let data = {
      problemId : await Problem.random(),
      roomId : `room${i}`,
      totalUsers: 0,
      userHistory: userHistory
    }
    let gamelog = await GameLog.createLog(data)
    // console.log(gamelog)
    await User.addGameLog(gamelog)
    
  }
}
const num = 0
makeGamelog(num)


const userIds =[
    mongoose.Types.ObjectId('62e63483031a45c3d48b2b48'),
    mongoose.Types.ObjectId("62e63549e9f30931ffff50d8"),
    mongoose.Types.ObjectId("62e63bafb1fc530005d8588e"),
    mongoose.Types.ObjectId("62e63bceb1fc530005d8589e"),
    mongoose.Types.ObjectId("62e63f1953aa28ac756d5482"),
    mongoose.Types.ObjectId("62e63fd2fa0f2b1410364f30"),  
    mongoose.Types.ObjectId("62e6443ecd40acd595377678"),
    mongoose.Types.ObjectId("62e7c9c454f8dfc73c929e80"),
  ]

//마이페이지 기존방식으로 시간 테스트
async function test1(){
    const id = userIds[0]
    // const start = new Date()
    const start = new Date()
    const userinfo = await User.getUserInfo(id)
    // 게임로그 우선게임 20개 가져오기
    let cnt =0
    for (let i=0 ; i<3000; i++){
        let log = await GameLog.getLog(userinfo["gameLogHistory"][i])
        // if (log == null){
        //     continue
        // }
        // if (log["userHistory"][0]["gitId"] === userinfo["gitId"]){
        //     cnt += 1
        //     // console.log(new Date()-start,new Date(),cnt)            
        // }
        // if (cnt >= 50){
        //     break
        // }
        // console.log(new Date()-start,new Date())
    }
    // console.log(new Date()-start,new Date())
    console.log("test1===",new Date()-start)
}

async function test2(){
    const id = userIds[0]
    const start = new Date()
    const gameLogs = await UserHistory.getAllLog(id)
    for (let i=0; i<gameLogs.length; i++){
        // console.log(id)
        // console.log(gameLogs[i]["_id"])
        let tmp = await UserHistory.getOtherLog(gameLogs[i]["gameId"])
        
        // for (let j = 0; j < tmp.length; j++){
        //     // console.log(tmp[j]["gitId"])
        //     if (tmp[j]["ranking"]===1){
        //         console.log(tmp[j]["gitId"])
        //         console.log(new Date() - start)
        //     }
        // }
    }
    console.log("test2===",new Date()-start)
}

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});
// test1() 
// test2()
