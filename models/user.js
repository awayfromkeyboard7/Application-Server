const mongoose = require("mongoose");
const crypto = require('../models/keycrypto');
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
  avatarUrl: {
    type: String,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  problemHistory: {
    type: [
      {
        type: Object,
        ref: "Problem",
      },
    ],
    default: [],
  },
  gameLogHistory: {
    type: [
      {
        type: Object,
        ref: "Gamelog",
      },
    ],
    default: [],
  },
  ranking: {
    type: Number,
    default: 9999999999,
  },
  following: {
    type: Array,
    default: []
  },
  follower: {
    type: Array,
    default: []
  }
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

//유저 전체정보 반환
UserSchema.statics.getUserInfo = async function (gitId) {
  const user = await this.findOne({ gitId: gitId });
  return user;
};

//전체 랭킹 업데이트
UserSchema.statics.totalRankUpdate = async function () {
  // console.log("passhere?!?!@#!@#!$!@#!!hello");
  const result = await this.aggregate([
    {
      $setWindowFields: {
        partitionBy: "$state",
        sortBy: {
          totalScore: -1,
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

UserSchema.statics.addGameLog = async function (gameLog){
  const problemId = gameLog.problemId["_id"]
  const gameLogId = gameLog._id

  allUser = [gameLog.userHistory, gameLog.teamA, gameLog.teamB]

  for (let j = 0 ; j<3 ; j++){
    for (let i = 0 ; i<allUser[j].length; i++){
      let userLog = await this.find({ gitId : allUser[j][i].gitId })    
      let gameLogHistory = userLog[0]["gameLogHistory"]
      let problemHistory = userLog[0]["problemHistory"]
      gameLogHistory.push(gameLogId)
      problemHistory.push(problemId)
      await this.findOneAndUpdate(
        {gitId : allUser[j][i].gitId},
        {
          $set: {
            problemHistory : problemHistory,
            gameLogHistory : gameLogHistory
          }
        },
        { new: true}
      )
    }
  }
}

UserSchema.statics.following = async function (myNodeId, targetGitId) {
  const nodeId = parseInt(crypto.decrypt(myNodeId))
  console.log('decrypt nodeId >>>>>>>>>>> ', nodeId)
  
  const targetUser = await this.findOne({ gitId: targetGitId });

  // 나 자신을 팔로우 예외처리
  if (targetUser["nodeId"] !== nodeId) {
    await this.findOneAndUpdate(
      { nodeId: nodeId },
      {
        $addToSet: {
          following: targetUser["nodeId"]
        },
      },
      { new: true }
    );

    await this.findOneAndUpdate(
      { nodeId: targetUser["nodeId"] },
      {
        $addToSet: {
          follower: nodeId
        },
      }
    );
  }
}

UserSchema.statics.getFollowerListWithGitId = async function (myGitId) {
  const user = await this.findOne({ gitId: myGitId });
  // Promise.all을 사용한 이유 https://joyful-development.tistory.com/20
  if (user !== null) {
    const followerList = await Promise.all (user['follower'].map( async (friendNodeId) => {
      const friend = await this.findOne({ nodeId: friendNodeId })
      return friend.gitId
    }))
    return followerList;
  }
}


UserSchema.statics.getFollowingList = async function (myNodeId) {
  const nodeId = parseInt(crypto.decrypt(myNodeId));
  const user = await this.findOne({ nodeId: nodeId });
  // Promise.all을 사용한 이유 https://joyful-development.tistory.com/20
  const followingList = await Promise.all (user['following'].map( async (friendNodeId) => {
    const friend = await this.findOne({ nodeId: friendNodeId })
    return {
      gitId: friend.gitId,
      avatarUrl: friend.avatarUrl
    }
  }))
  return followingList;
}

UserSchema.statics.getFollowingUserWithGitId = async function (myGitId) {
  const user = await this.findOne({ gitId: myGitId });
  // Promise.all을 사용한 이유 https://joyful-development.tistory.com/20
  if (user !== null) {
    const followingList = await Promise.all (user['following'].map( async (friendNodeId) => {
      const friend = await this.findOne({ nodeId: friendNodeId })
      return friend.gitId
    }))
    return followingList;
  }
}

UserSchema.statics.getUserInfoWithNodeId = async function (myNodeId) {
  const nodeId = parseInt(crypto.decrypt(myNodeId));
  const user = await this.findOne({ nodeId: nodeId });
}

module.exports = mongoose.model("User", UserSchema);
