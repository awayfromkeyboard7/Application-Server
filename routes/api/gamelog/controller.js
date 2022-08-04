const mongoose = require("mongoose");
const GameLog = require("../../../models/db/gamelog");
const Interval = require("../../../models/interval");
const Problem = require("../../../models/db/problem");
const User = require("../../../models/db/user");
const Auth = require("../../../models/auth");
const url = require('url');

exports.createGamelog = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies["jwt"]);
    if (payload !== false) {
      const info = {
        problemId: await Problem.random(),
        userHistory: req.body.players,
        totalUsers: req.body.totalUsers,
        roomId: req.body.roomId,
      };
      const gameLog = await GameLog.createLog(info);
      User.addGameLog(gameLog);
      info.userHistory.forEach((item) => console.log(item.gitId));
      res.status(200).json({
        gameLogId: gameLog._id,
        success: true,
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Invalid JWT Token",
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getProblem = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies["jwt"]);
    const query = url.parse(req.url, true).query;
    if (payload !== false) {
      let info = await GameLog.getLog(query.id);
      const problemId = mongoose.Types.ObjectId(
        query.mode === "team" ? "62cea4c0de41eb81f44ed976" : "62e0f67f8f1ac997694d4e86"
      );
      const problem = await Problem.getProblem(problemId);
      info.problemId = problem;
      res.status(200).json({
        info,
        success: true,
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Invalid JWT Token",
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getGamelog = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies["jwt"]);
    const query = url.parse(req.url, true).query;
    if (payload !== false) {
      let info = await GameLog.getLog(query.id);
      res.status(200).json({
        info,
        success: true,
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Invalid JWT Token",
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateGamelog = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies["jwt"]);
    const mode = req.params.mode;
    if (payload.gitId === req.body.gitId) {

      if (mode === 'solo') {
        let gameLog = await GameLog.updateLog(req.body);
        if (gameLog["totalUsers"] === 0) {
          gameLog = await GameLog.finished(gameLog);
          await gameLog.save();
          Interval.deleteInterval(gameLog["roomId"], "solo");
          await User.totalRankUpdate();
        }
      }
      else {
        let gameLog = await GameLog.updateLogTeam(req.body);
        if (gameLog["totalUsers"] === 0) {
          gameLog = await GameLog.finishedTeam(gameLog);
          await gameLog.save();
          Interval.deleteInterval(
            [gameLog["roomIdA"], gameLog["roomIdB"]],
            "team"
          );
          await User.totalRankUpdate();
        }
      }
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Invalid JWT Token",
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};
