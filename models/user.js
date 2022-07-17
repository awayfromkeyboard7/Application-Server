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
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'problems'
    }],
    default: []
  },
  gameLogHistory: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'gamelogs'
    }],
    default: []
  },
  ranking: {
    type: Number,
    default: 999999
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

UserSchema.statics.updateUserScore = async function (gitId, score) {
  console.log(gitId, score);
  return await this.findOneAndUpdate(
    {gitId: gitId},
    {
      $inc: {
        totalScore: score,
      }
    },
    {new: true}
  )
}

// 게임 끝난 후 업데이트
UserSchema.statics.updateUserInfo = async function (gitId, info) {
  return await this.findOneAndUpdate(
    {gitId: gitId},
    {
      $push: {
        problemHistory: mongoose.Types.ObjectId(info['problemId']),
        gameLogHistory: mongoose.Types.ObjectId(info['gameLogId'])
      }
    },
    {new: true}
  )
}

UserSchema.statics.getUserImage = async function (gitId) {
  const user = await this.findOne({gitId: gitId});
  return user['imgUrl'];
}

module.exports = mongoose.model('User', UserSchema);