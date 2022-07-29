const request = require('superagent');
const mongoose = require('mongoose');
const GameLog = require('../../../models/db/gamelog');
const Interval = require('../../../models/interval');
const Problem = require('../../../models/db/problem');
const User = require('../../../models/db/user');
const Ranking = require('../../../models/db/ranking');

exports.updateGamelogTeam = async (req, res) => {
  try {
    await GameLog.updateLogTeam(req.body);
    if (await GameLog.isFinishTeam(req.body)) {
      const gameLog = await GameLog.getLog(req.body["gameId"])
      Interval.deleteInterval([gameLog["roomIdA"],gameLog["roomIdB"]],'team');
      Ranking.updateRanking(await User.totalRankUpdate());
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
    if (await GameLog.isFinish(req.body)) {

      const gameLog = await GameLog.getLog(req.body.gameId);
      Interval.deleteInterval(gameLog["roomId"],'solo')
      await Ranking.updateRanking(await User.totalRankUpdate());
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

    const problemId = mongoose.Types.ObjectId(req.body.mode === 'team' ? '62cea4c0de41eb81f44ed976' : '62e0f67f8f1ac997694d4e86');
    const problems = await Problem.getProblem(problemId);
    info.problemId = problems
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