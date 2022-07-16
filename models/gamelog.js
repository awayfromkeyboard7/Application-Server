const mongoose = require('mongoose');
const Problem = require('./problem');
const Schema = mongoose.Schema;

/* userHistory: Array of attributes updated after game closed */
const UserHistorySchema = new Schema({
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

// const TeamInfo = new Schema({
//   player: {
//     type: [UserHistorySchema],
//     default: []
//   },
//   language: {
//     type: String,
//     default : ''
//   },
//   code: {
//     type: String,
//     default: ''
//   },
//   submitAt: {
//     type: Date,
//     default: Date.now
//   },
//   ranking: {
//     type: Number,
//     default: 0
//   },
//   passRate: {
//     type: Number,
//     default: -1
//   }

// });

const GameLogSchema = new Schema({
  startAt: {
    type: Date,
    default : Date.now,
    required: true
  },

  gameMode: {
    type: String,
    default : 'personal'
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

  roomIdA: {
    type: String,
    default : false
  },
  
  roomIdB: {
    type: String,
    default : false
  }, 

  totalUsers: {
    type: Number,
    default: 0
  }

});

GameLogSchema.statics.createLog = function(data) {
  
  return this.create(data);
}

GameLogSchema.statics.createTeamLog = async function(teamA, teamB, roomIdA, roomIdB) {

  const data ={
    problemId : await Problem.random(),
    teamA : teamA,
    teamB : teamB,
    gameMode : 'team',
    roomIdA : roomIdA,
    roomIdB : roomIdB
  }
  const newLog = await this.create(data);
  console.log('newLog>>>>', newLog._id)
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
  console.log("updateLogTeam?>>>>>>>>", data);
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
  gameLog.save();
  
  return gameLog
};


GameLogSchema.statics.getLog = function(logId) {
  console.log('getLog::>>>>:>?>?>DFSDF', logId);
  return this.findById(mongoose.Types.ObjectId(logId));
}

module.exports = mongoose.model('GameLog', GameLogSchema);