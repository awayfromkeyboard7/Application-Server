const SENDBIRD_API_TOKEN = process.env.SENDBIRD_API_TOKEN;
const request = require('superagent');
const { find } = require('../../../models/gamelog');
const GameLog = require('../../../models/gamelog');
const problem = require('../../../models/problem');
const Problem = require('../../../models/problem');
// require("dotenv").config();

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

exports.create = async (req, res) => {
    try {
    console.log(req.body);
      const channel = await GameLog.createLog(req.body);
    //   const channel = await GameLog.findAll();
  
      res.status(200).json({
        // channel,
        success: true
      });
    } catch(err) {
      res.status(409).json({
        success: false,
        message: err.message
      });
    }
  };

exports.updateGamelog = async (req, res) => {
  console.log('updategamelog')
  try {
    
    const update_gamelog = await GameLog.updateLog(req.body);

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

//도현 추가
exports.createGamelog = async (req, res) => {
  try {
    const moderater = {
      gitId : req.body['gitId'],
    }

    const info = {
      problemId : await Problem.random(),
      userHistory: [moderater]
    }

    const GameLog_id = await GameLog.createLog(info);

    res.status(200).json({
      GameLog_id,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};
