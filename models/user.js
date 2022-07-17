const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  gitId: {
    type: String,
    required: true,
  },
  nodeId: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  problemHistory: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    default: [],
  },
  gameLogHistory: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gamelog",
      },
    ],
    default: [],
  },
  ranking: {
    type: Number,
    default: 9999999999,
  },
});

// 모든 유저 목록
UserSchema.statics.findAll = function () {
  return this.find();
};

// 기존 유저 토큰 업데이트
UserSchema.statics.isExist = function (nodeId, token) {
  console.log("nodeId:", nodeId);
  return this.findOneAndUpdate(
    { nodeId: nodeId },
    { token: token },
    { new: true }
  );
};

// 신규 유저 등록
UserSchema.statics.createUser = function (info) {
  return this.create(info);
};

UserSchema.statics.updateUserScore = async function (gitId, score) {
  console.log(gitId, score);
  return await this.findOneAndUpdate(
    { gitId: gitId },
    {
      $inc: {
        totalScore: score,
      },
    },
    { new: true }
  );
};

// 게임 끝난 후 업데이트
UserSchema.statics.updateUserInfo = async function (gitId, info) {
  return await this.findOneAndUpdate(
    { gitId: gitId },
    {
      $push: {
        problemHistory: mongoose.Types.ObjectId(info["problemId"]),
        gameLogHistory: mongoose.Types.ObjectId(info["gameLogId"]),
      },
    },
    { new: true }
  );
};

UserSchema.statics.getUserImage = async function (gitId) {
  const user = await this.findOne({ gitId: gitId });
  return user["imgUrl"];
};

UserSchema.statics.totalRankUpdate = async function () {
  // console.log("passhere?!?!@#!@#!$!@#!!hello");
  const result = await this.aggregate([
    {
      $setWindowFields: {
        partitionBy: "$state",
        sortBy: {
          totalScore: -1,
          nodeId: -1,
        },
        output: {
          ranking: {
            $rank: {},
          },
        },
      },
    },
  ]);

  for (let i = 0; i < result.length; i++) {
    let gitId = result[i]["gitId"];
    await this.findOneAndUpdate(
      { gitId: gitId },
      {
        $set: {
          ranking: result[i]["ranking"],
        },
      },
      { new: true }
    );
  }
  return result;
};

module.exports = mongoose.model("User", UserSchema);
