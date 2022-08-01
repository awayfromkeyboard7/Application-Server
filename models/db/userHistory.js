const mongoose = require('mongoose');
const Problem = require('./problem');
const User = require('./user');
const Code = require('./code');
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
    type: Schema.Types.ObjectId,
    ref: "Code",
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
  },
  mode: {
    type: String,
    default: ""
  }
});

UserHistorySchema.statics.create = function(data) {
  return this.create(data);
}

UserHistorySchema.statics.update = async function(data) {
  
  const code = await Code.createCode(data["code"])

  return this.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(data['gameId']) },
    { 
      $set: { 
        'userHistory.$[element].language': data['language'],
        'userHistory.$[element].code': code["_id"],
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

GameLogSchema.statics.updateTeam = async function(data) {
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


module.exports = mongoose.model('UserHistory', UserHistorySchema);