const mongoose = require('mongoose');
const User = require('./user');
const Code = require('./code');
const Schema = mongoose.Schema;

/* userHistory: Array of attributes updated after game closed */
const UserHistorySchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },  
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
    required: false
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

UserHistorySchema.statics.createHistory = async function(data) {
  await this.create(data);
}

UserHistorySchema.statics.updateHistory = async function(data,code) {
  if (code == false){
    console.log("passhere????????")
    console.log(data)
    await this.findOneAndUpdate(
      {"gitId" : data["gitId"],"gameId": data["gameId"]},
      {
        $set: {
          ranking: data['ranking'],
        }
      },
      {
        new:true
      }
    ).exec()

  }else{
    await this.findOneAndUpdate(
      {"gitId" : data["gitId"],"gameId": data["gameId"]},
      {
        $set: {
          language: data['language'],
          code: code["_id"],
          submitAt: data['submitAt'],
          ranking: data['ranking'],
          passRate: data['passRate']
        }
      },
      {
        new:true
      }
    ).exec()
  }
  // console.log("showmearray======",array["gitId"],array["gameId"])
};

UserHistorySchema.statics.updateTeam = async function(data) {
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

UserHistorySchema.statics.getOtherLog = async function(gameId){
  // console.log(gameId)
  return await this.find(
    {
      gameId : gameId
    }
  )
}

UserHistorySchema.statics.getAllLog = async function(userId){
  console.log(userId)
  return await this.find(
    {
      userId : userId,
      // ranking: 1
      // ranking: { $gte: 1, $lte: 3}, 
    },
      {_id:0,"gameId" :1}
    ).limit(30)
}

UserHistorySchema.statics.getLog = function(logId) {
  return this.findById(mongoose.Types.ObjectId(logId));
}


module.exports = mongoose.model('UserHistory', UserHistorySchema);