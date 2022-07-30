const mongoose = require('mongoose');
const Problem = require('./problem');
const User = require('./user');
const Schema = mongoose.Schema;

/* userHistory: Array of attributes updated after game closed */
const UserHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  gitId: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default : ''
  },
  code: {
    type: String,
    default: ''
  },
  submitAt: {
    type: Date,
    default: Date.now
  },
  ranking: {
    type: Number,
    default: 0
  },
  passRate: {
    type: Number,
    default: -1
  }
});

const GameLogSchema = new Schema({
  startAt: {
    type: Date,
    default : Date.now,
    required: true
  },
  gameMode: {
    type: String,
    default : 'solo'
  },
  problemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Problem',
  },
  userHistory: {
    type: [UserHistorySchema],
    defualt: []
  },
  teamA: {
    type: [UserHistorySchema],
    default: []
  },
  teamB: {
    type: [UserHistorySchema],
    defualt: []
  },
  roomId: {
    type: String,
    default : false
  },
  roomIdA: {
    type: String,
    default : false
  },
  roomIdB: {
    type: String,
    default : false
  },
  totalUsers :{
    type: Number,
    default : 0
  }

});

GameLogSchema.statics.createLog = function(data) {
  return this.create(data);
}

GameLogSchema.statics.createTeamLog = async function(teamA, teamB, roomIdA, roomIdB) {
  const data = {
    problemId: await Problem.random(),
    teamA,
    teamB,
    gameMode: 'team',
    roomIdA,
    roomIdB,
    totalUsers: 2
  }
  const newLog = await this.create(data);
  // console.log('newLog>>>>', newLog._id)
  return newLog._id;
}

GameLogSchema.statics.updateLog = function(data) {
  return this.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(data['gameId']) },
    { 
      $set: { 
        'userHistory.$[element].language': data['language'],
        'userHistory.$[element].code': data['code'],
        'userHistory.$[element].submitAt': data['submitAt'],
        'userHistory.$[element].ranking': data['ranking'],
        'userHistory.$[element].passRate': data['passRate']
      }
    },
    { 
      arrayFilters: [{ 'element.gitId': data['gitId'] }],
      new: true
    }
  ).exec();
};

GameLogSchema.statics.updateLogTeam = async function(data) {
  // console.log("updateLogTeam?>>>>>>>>", data);
  const gameLog = await this.findById(mongoose.Types.ObjectId(data["gameId"]));
  let myteam = "teamA";
  for (let userInfo of gameLog["teamB"]){
    if (userInfo.gitId === data["gitId"]){
      myteam = "teamB"
      break
    } 
  }
  gameLog[myteam][0]['language'] = data['language']
  gameLog[myteam][0]['code'] = data['code']
  gameLog[myteam][0]['submitAt'] = data['submitAt']
  gameLog[myteam][0]['ranking'] = data['ranking']
  gameLog[myteam][0]['passRate'] = data['passRate']
  await gameLog.save();
  return 
};


GameLogSchema.statics.getLog = function(logId) {
  return this.findById(mongoose.Types.ObjectId(logId));
}

//도현 추가
GameLogSchema.statics.isFinish = async function(data){
  const gameLog = await this.findById(mongoose.Types.ObjectId(data["gameId"]));
  gameLog["totalUsers"] -= 1;
  if (gameLog["totalUsers"] === 0){

    const userLength = gameLog["userHistory"].length
    await gameLog["userHistory"].sort((a, b) => {
      if (a.passRate === b.passRate) {
        return a.submitAt - b.submitAt;
      } else {
        return b.passRate - a.passRate;
      }
    });
    // User.updateUserInfo(gitId,data);
    let i = 0
    let info ={}
    for await (const user of gameLog["userHistory"]){
      user["ranking"] = i+1;
      info["gitId"] = user["gitId"]
      info["mode"] = 'solo'
      info["passRate"] = user["passRate"]
      info["language"] = user["language"]
      info["score"] = userLength - 2*i
      info["win"] = (i+1 - userLength/2) < 1
      i += 1;
      await User.updateUserScore(info);
    }
    await gameLog.save()
    return true;
  };

  await gameLog.save();
}

GameLogSchema.statics.isFinishTeam = async function(data){
  const gameLog = await this.findById(mongoose.Types.ObjectId(data["gameId"]));
  gameLog["totalUsers"] -= 1;

  if (gameLog["totalUsers"] === 0){
    let result = [gameLog["teamA"], gameLog["teamB"]];
    result.sort((a, b) => {
      if (a[0].passRate === b[0].passRate) {
        return a[0].submitAt - b[0].submitAt;
      } else {
        return b[0].passRate - a[0].passRate;
      }
    });

    const winnerScore = result[1].length;
    const loserScore = -1*result[0].length;
    const info = {}

    for await (const winner of result[0]){
      winner["ranking"] = 1;
      info["gitId"] = winner["gitId"]
      info["mode"] = 'team'
      info["passRate"] = result[0][0]["passRate"]
      info["language"] = result[0][0]["language"]
      info["score"] = winnerScore
      info["win"] = true
      User.updateUserScore(info);
    }

    for await (const loser of result[1]){
      loser["ranking"] = 2;
      info["gitId"] = loser["gitId"]
      info["mode"] = 'team'
      info["passRate"] = result[1][0]["passRate"]
      info["language"] = result[1][0]["language"]
      info["score"] = loserScore
      info["win"] += false
      User.updateUserScore(info);
    }
    gameLog.save();
    return true;
  };

  gameLog.save();
}

module.exports = mongoose.model('GameLog', GameLogSchema);