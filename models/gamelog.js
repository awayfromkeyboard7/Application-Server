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

  roomIdA :{
    type: String,
    default : false
  },
  
  roomIdB :{
    type: String,
    default : false
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
  if (data['submitAt'] === null) {
    const date = Date.now();
  } else {
    const date = new Date(data['submitAt'])
  }
  return this.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(data['gameId']) },
    { 
      $set: { 
        'userHistory.$[element].language': data['language'],
        'userHistory.$[element].code': data['code'],
        'userHistory.$[element].submitAt': date,
        'userHistory.$[element].ranking': data['ranking'],
        'userHistory.$[element].passRate': data['passRate']
      }
    },
    { 
      arrayFilters: [{ 'element.gitId': data['gitId'] }],
      new: true
    }
  )
};

GameLogSchema.statics.updateLogTeam = async function(data) {
  let date;
  if (data['submitAt'] === null) {
    date = Date.now();
  } else {
    date = new Date(data['submitAt']);
  }
  console.log("updateLogTeam?>>>>>>>>", data);
  const gameLog = this.findById(mongoose.Types.ObjectId(data["gameId"]));
  console.log("gamelfiajsdofasd?>>>>>>>>",gameLog);
  let myteam = "teamA";
  for (let userInfo of gameLog["teamB"]){
    if (userInfo.gitId === data["gitId"]){
      myteam = "teamB"
      break
    } 
  }

  if (myteam === "teamA"){
    await this.findByIdAndUpdate(
      mongoose.Types.ObjectId(data['gameId']),
      { 
        $set: { 
          'teamA.0.language': data['language'],
          'teamA.0.code': data['code'],
          'teamA.0.submitAt': date,
          'teamA.0.ranking': data['ranking'],
          'teamA.0.passRate': data['passRate']
        }
      },
    )
  }
  else {
    await this.findByIdAndUpdate(
      mongoose.Types.ObjectId(data['gameId']),
      { 
        $set: { 
          'teamB.0.language': data['language'],
          'teamB.0.code': data['code'],
          'teamB.0.submitAt': date,
          'teamB.0.ranking': data['ranking'],
          'teamB.0.passRate': data['passRate']
        }
      },
    )
  };
  this.save();
};


GameLogSchema.statics.getLog = function(logId) {
  console.log('getLog::>>>>:>?>?>DFSDF', logId);
  return this.findById(mongoose.Types.ObjectId(logId));
}

module.exports = mongoose.model('GameLog', GameLogSchema);