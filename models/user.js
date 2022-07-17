const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  gitId: {
    type: String,
    required: true
  },
  nodeId: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
  },
  totalScore: {
    type: Number,
    default: 0
  },
  problemHistory: {
    type: Array,
    default: []
  },
  gameHistory: {
    type: Array,
    default: []
  },
  ranking:{
    type: Number,
    default: 9999999999 
  }
});

// 모든 유저 목록
UserSchema.statics.findAll = function () {
  return this.find()
};

// 기존 유저 토큰 업데이트
UserSchema.statics.isExist = function (nodeId, token) {
  console.log('nodeId:', nodeId);
  return this.findOneAndUpdate({nodeId: nodeId}, {token: token}, {new: true});
}

// 신규 유저 등록
UserSchema.statics.createUser = function (info) {
	return this.create(info);
}

UserSchema.statics.updateUserRank = async function (gitId, rank) {
  const user = await this.findOne({gitId: gitId});
  return await this.findOneAndUpdate(
    {gitId: gitId},
    {
      totalScore: user.totalScore + rank,
    },
    {new: true}
  )
}

// 게임 끝난 후 업데이트
// user = await User.updateUserInfo(user.nodeId, {score: 4, problemId: 8, gameId: 8})
UserSchema.statics.updateUserInfo = async function (gitId, info) {
  const user = await this.findOne({gitId: gitId});
  return await this.findOneAndUpdate(
    {gitId: gitId},
    {
      $push: {
        problemHistory: info['problemId'],
        gameHistory: info['gameLogId']
      }
    },
    {new: true}
  )
}

UserSchema.statics.getUserImage = async function (gitId) {
  console.log('gitId:', gitId)
  const user = await this.findOne({gitId: gitId});
  console.log(user['imgUrl']);
  return user['imgUrl'];
}

UserSchema.statics.totalRankUpdate = async function (){
  console.log("passhere?!?!@#!@#!$!@#!!hello");
  const result = await this.aggregate([
    {
      $setWindowFields: {
        partitionBy: "$state",
        sortBy: { 
          totalScore: -1,
          nodeId: -1
        },
        output: {
           ranking: {
              $rank: {}
            }
        }
      }  
    }
  ]);

  for (let i =0; i< result.length ; i++ ){
    let gitId = result[i]["gitId"]  
    // console.log("hoxyprint????????????????",logId)
    await this.findOneAndUpdate(
      {gitId : gitId},
      {
        $set: {
          "ranking": result[i]["ranking"]
        }
      },
      { new: true }
    );
  }
  return result
}
module.exports = mongoose.model('User', UserSchema);