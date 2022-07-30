const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    default: [],
  },
  gameLogHistory: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Gamelog",
      },
    ],
    default: [],
  },
  ranking: {
    type: Number,
    default: 9999999999,
  },
  rankingPercent: {
    type: Number,
    default: 100,
  },
  rank: {
    type: Number,
    default: 0,
  },
  following: {
    type: Array,
    default: [],
  },
  follower: {
    type: Array,
    default: [],
  },
  language: {
    type: Object,
    default: {
      Python: 0,
      JavaScript: 0,
      CPP: 0,
    },
  },
  mostLanguage: {
    type: String,
    default: "",
  },
  totalPassRate: {
    type: Number,
    default: false,
  },
  totalSolo: {
    type: Number,
    default: false,
  },
  totalTeam: {
    type: Number,
    default: 0,
  },
  winSolo: {
    type: Number,
    default: 0,
  },
  winTeam: {
    type: Number,
    default: 0,
  },
});

// 모든 유저 목록
UserSchema.statics.findAll = function () {
  return this.find();
};

// 기존 유저 토큰 업데이트
UserSchema.statics.isExist = function (nodeId) {
  return this.findOne({ nodeId: nodeId });
};

// 신규 유저 등록
UserSchema.statics.createUser = function (info) {
  return this.create(info);
};

UserSchema.statics.updateUserScore = async function (info) {
  const userInfo = await this.findOne({ gitId: info["gitId"] });
  //유저 점수&랭크 업데이트
  userInfo["totalScore"] += info["score"];
  if (userInfo["totalScore"] < 0) {
    userInfo["totalScore"] = 0;
    userInfo["rank"] = 0;
  } else if (50 <= userInfo["totalScore"]) {
    userInfo["rank"] = 5;
  } else {
    userInfo["rank"] = parseInt(userInfo["totalScore"] / 10);
  }

  //판수, 승리 횟수 추가
  if (info["mode"] == "solo") {
    userInfo["totalSolo"] += 1;
    if (info["win"]) {
      userInfo["winSolo"] += 1;
    }
  } else {
    userInfo["totalTeam"] += 1;
    if (info["win"]) {
      userInfo["winTeam"] += 1;
    }
  }
  //passrate 추가
  userInfo["totalPassRate"] += info["passRate"];
  //사용 언어 추가 밑 갱신
  userInfo["language"][info["language"]] += 1;
  userInfo.markModified('language');
  let mostUsed = userInfo["mostLanguage"];
  if (
    mostUsed == "" || userInfo["language"][info["language"]] >= userInfo["language"][mostUsed]
  ) {
    userInfo["mostLanguage"] = info["language"];
  }
  await userInfo.save();
  return true;
};

//유저 전체정보 반환
UserSchema.statics.getUserInfo = async function (id) {
  const user = await this.findById(mongoose.Types.ObjectId(id));
  return user;
};

//유저 전체정보 반환
UserSchema.statics.getUserInfoByGitId = async function (gitId) {
  const user = await this.findOne({ gitId });
  return user;
};

//전체 랭킹 업데이트
UserSchema.statics.totalRankUpdate = async function () {
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
          rankingPercent:
            parseInt((1000 * result[i]["ranking"]) / result.length) / 10,
        },
      },
      { new: true }
    );
  }
  return result;
};

UserSchema.statics.addGameLog = async function (gameLog) {
  const problemId = await gameLog.problemId["_id"];
  const gameLogId = await gameLog._id;

  allUser = [gameLog.userHistory, gameLog.teamA, gameLog.teamB];

  for (let j = 0; j < allUser.length; j++) {
    for (let i = 0; i < allUser[j].length; i++) {
      let currentUser = await allUser[j][i];
      let userLog = await this.find({ gitId: currentUser["gitId"] });
      let gameLogHistory = userLog[0]["gameLogHistory"];
      let problemHistory = userLog[0]["problemHistory"];
      gameLogHistory.push(gameLogId);
      problemHistory.push(problemId);
      await this.findOneAndUpdate(
        { gitId: currentUser["gitId"] },
        {
          $set: {
            problemHistory: problemHistory,
            gameLogHistory: gameLogHistory,
          },
        },
        { new: true }
      );
    }
  }
};

UserSchema.statics.following = async function (myId, friendId) {
  // 나 자신을 팔로우 예외처리
  if (myId !== friendId) {
    await this.findByIdAndUpdate(
      mongoose.Types.ObjectId(myId),
      {
        $addToSet: {
          following: friendId,
        },
      }
    );

    await this.findByIdAndUpdate(
      mongoose.Types.ObjectId(friendId),
      {
        $addToSet: {
          follower: myId,
        },
      }
    );
  }
};

UserSchema.statics.getFollowerList = async function (myId) {
  const user = await this.findById(mongoose.Types.ObjectId(myId));
  // Promise.all을 사용한 이유 https://joyful-development.tistory.com/20
  try {
    if (user !== null) {
      const followerList = await Promise.all(
        user["follower"].map(async (friendId) => {
          const friend = await this.findById(mongoose.Types.ObjectId(friendId));
          return friend.gitId;
        })
      );
      return followerList;
    }
  } catch (e) {
    console.log(`[getFollowerListWithGitId][ERROR] :::: myId: ${myId}`);
    console.log(`[getFollowerListWithGitId][ERROR] :::: log: ${e}`);
  }
};

UserSchema.statics.getFollowingList = async function (myId) {
  try {
    const user = await this.findById(mongoose.Types.ObjectId(myId));
    // Promise.all을 사용한 이유 https://joyful-development.tistory.com/20
    const followingList = await Promise.all(
      user["following"].map(async (friendId) => {
        const friend = await this.findById(mongoose.Types.ObjectId(friendId));
        return {
          gitId: friend?.gitId,
          avatarUrl: friend?.avatarUrl,
        };
      })
    );
    return followingList;
  } catch (e) {
    console.log(`[getFollowingList][ERROR] :::: myId: ${myId}`);
    console.log(`[getFollowingList][ERROR] :::: log: ${e}`);
  }
};

UserSchema.statics.paging = function(start, count) {
  const selectOptions = ['_id', 'gitId', 'avatarUrl', 'ranking', 'rank', 'mostLanguage', 'winSolo', 'winTeam', 'totalSolo', 'totalTeam'];
  return this.find().sort({ totalScore: -1, nodeId: 1 }).skip(start).limit(count).select(selectOptions);
};

UserSchema.statics.unfollow = async function (myId, friendId) {
  await this.findByIdAndUpdate(
    mongoose.Types.ObjectId(myId),
    {
      $pull: {
        following: friendId,
      },
    }
  );

  await this.findByIdAndUpdate(
    mongoose.Types.ObjectId(friendId),
    {
      $pull: {
        follower: myId,
      },
    }
  );
}

UserSchema.methods.count = function() {
	return this.count();
};

module.exports = mongoose.model("User", UserSchema);