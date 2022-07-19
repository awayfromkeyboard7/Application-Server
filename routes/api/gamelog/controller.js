const request = require('superagent');
const mongoose = require('mongoose');
const GameLog = require('../../../models/gamelog');
const Interval = require('../../../models/interval');
const Problem = require('../../../models/problem');
const User = require('../../../models/user');

/*
[Game Logs] 개인전 / 팀전
- 해당 게임 랭킹 | 점수
- 참여자 아이디 배열

POST: /api/gamelog
{
  startAt: {
    type: Date,
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Problem'
  },
  userHistory: {
    type: [UserHistorySchema],
    required: true
  }
}
*/
exports.updateGamelogTeam = async (req, res) => {
  // console.log('updategamelogTeam', req.body);
  try {
    await GameLog.updateLogTeam(req.body);
    const userScores = await GameLog.isFinishTeam(req.body);
    console.log('updategamelogTeam:::::::', userScores);
    if (userScores) {
      const gameLog = await GameLog.getLog(req.body["gameId"])
      // console.log("gamelog???!?@!@!!!#!@#!@#!@#@!#!@#",gameLog)
      // Interval.deleteInterval("hoxy??",'team')
      Interval.deleteInterval([gameLog["roomIdA"],gameLog["roomIdB"]],'team');
      User.totalRankUpdate();
      console.log(Object.entries(userScores));
      await Object.entries(userScores).forEach(([gitId, score]) => User.updateUserScore(gitId, score));
    }

    res.status(200).json({
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    })
  }
};

exports.updateGamelog = async (req, res) => {
  try {
    await GameLog.updateLog(req.body);
    const userScores = await GameLog.isFinish(req.body);
    // console.log("@#@#@#@##@#@#showme reqbody!@!@@#@#@#@#@#@#@#!@!",userScores)
    if (userScores) {
      const gameLog = await GameLog.getLog(req.body.gameId);

      // console.log("@!#!@#!@#!gamelog isit???????",gameLog["roomId"])
      Interval.deleteInterval(gameLog["roomId"],'solo')
      User.totalRankUpdate();
      Object.entries(userScores).forEach(([gitId, score]) => User.updateUserScore(gitId, score));
    }
    res.status(200).json({
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    })
  }
};

exports.createGamelog = async (req, res) => {
  try {
    // roomId = 연어

    const info = {
      problemId : await Problem.random(),
      userHistory: req.body.players,
      totalUsers: req.body.totalUsers,
      roomId : req.body.roomId
    }
    // console.log("@@@@@@@@@@@@@@@@@@@@@@",length(req.body.players));
    const gameLog = await GameLog.createLog(info);
    User.addGameLog(gameLog);
    info.userHistory.forEach(item => console.log(item.gitId))
    res.status(200).json({
      gameLogId : gameLog._id,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};

exports.getGamelog = async (req, res) => {
  try {
    logId = req.body['gameLogId']
    let info = await GameLog.getLog(logId);

    console.log(req.body)
    const problemId = mongoose.Types.ObjectId(req.body.mode === 'team' ? '62cea4c0de41eb81f44ed976' : '62c973cd465933160b9499c1');
    const problems = await Problem.getProblem(problemId);
    info.problemId = problems
    // info.problemId = await Problem.getProblem(mongoose.Types.ObjectId(info.problemId));
    res.status(200).json({
      info,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};