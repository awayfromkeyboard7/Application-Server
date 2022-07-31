const request = require('superagent');
const mongoose = require('mongoose');
const GameLog = require('../../../models/db/gamelog');
const Interval = require('../../../models/interval');
const Problem = require('../../../models/db/problem');
const User = require('../../../models/db/user');
const Ranking = require('../../../models/db/ranking');
const Auth = require('../../../models/auth');

exports.updateGamelogTeam = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload.gitId === req.body.gitId) {
      await GameLog.updateLogTeam(req.body);
      if (await GameLog.isFinishTeam(req.body)) {
        const gameLog = await GameLog.getLog(req.body["gameId"])
        Interval.deleteInterval([gameLog["roomIdA"], gameLog["roomIdB"]], 'team');
        Ranking.updateRanking(await User.totalRankUpdate());
        // await User.totalRankUpdate()
      }
      res.status(200).json({
        success: true
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message
    })
  }
};

exports.updateGamelog = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload.gitId === req.body.gitId) {
      await GameLog.updateLog(req.body);
      if (await GameLog.isFinish(req.body)) {
        const gameLog = await GameLog.getLog(req.body.gameId);
        Interval.deleteInterval(gameLog["roomId"], 'solo')
        await Ranking.updateRanking(await User.totalRankUpdate());
      }
      res.status(200).json({
        success: true
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message
    })
  }
};

exports.createGamelog = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      const info = {
        problemId: await Problem.random(),
        userHistory: req.body.players,
        totalUsers: req.body.totalUsers,
        roomId: req.body.roomId
      }
      const gameLog = await GameLog.createLog(info);
      User.addGameLog(gameLog);
      info.userHistory.forEach(item => console.log(item.gitId))
      res.status(200).json({
        gameLogId: gameLog._id,
        success: true
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};

exports.getProblem = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      logId = req.body['gameLogId']
      let info = await GameLog.getLog(logId);

      const problemId = mongoose.Types.ObjectId(req.body.mode === 'team' ? '62cea4c0de41eb81f44ed976' : '62e0f67f8f1ac997694d4e86');
      const problems = await Problem.getProblem(problemId);
      info.problemId = problems
      res.status(200).json({
        info,
        success: true
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};

exports.getGamelog = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      logId = req.body['gameLogId']
      let info = await GameLog.getLog(logId);

      res.status(200).json({
        info,
        success: true
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};



exports.userRankLog = async (req, res) => {
  try {
    const userGitId = req.body.userId;
    const UserInfo = await User.getUserInfo(req.body.userId);
    const LangInfo = UserInfo.language
    const langLength = Object.keys(LangInfo).length
    const langKey = Object.keys(LangInfo)
    const langValue = Object.values(LangInfo)
    const gameLogId = UserInfo.gameLogHistory.reverse()
    const gameLogIdLength = Object.keys(gameLogId).length
    const LangArr = []
    const RankLogArr = []

    for (let i = 0; i < langLength; i++) {

    }

    for (let i = 0; i < langLength; i++) {
      LangArr.push({ name: langKey[i], value: langValue[i] })
    }


    function leftPad(value) {
      if (value >= 10) {
        return value;
      }
      return `0${value}`;
    }

    function toStringByFormatting(source, delimiter = '.') {
      const month = leftPad(source.getMonth() + 1);
      const day = leftPad(source.getDate());

      return [month, day].join(delimiter);
    }

    function toStringByFormattingHours(source, delimiter = ':') {
      const hours = leftPad(source.getHours());
      const Mnutes = leftPad(source.getMinutes());

      return [hours, Mnutes].join(delimiter);
    }

    for (let i = 0; i < gameLogIdLength; i++) {
      let gameLog = await GameLog.getLog(gameLogId[i]);
      let logLength = Object.keys(gameLog.userHistory).length
      if (gameLog.gameMode === 'personal') {
        for (let j = 0; j < logLength; j++) {
          let userHistoryString = JSON.stringify(gameLog.userHistory[j].userId)
          if (userHistoryString.includes(userGitId) && gameLog.userHistory[j].ranking !== 0) {
            const ranking = gameLog.userHistory[j].ranking;
            const submitAt = gameLog.userHistory[j].submitAt
            const key = `${toStringByFormatting(submitAt)} ${toStringByFormattingHours(submitAt)}`;
            if (RankLogArr.length >= 10) {
              break;
            } else {
              RankLogArr.unshift({ date: key, rank: ranking });
            }
          }
        }
      }
    }

    res.status(200).json({
      LangArr,
      RankLogArr,
      success: true
    });
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }

}