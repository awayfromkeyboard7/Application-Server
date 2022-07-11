const request = require('superagent');
const GameLog = require('../../../models/gamelog');
const Problem = require('../../../models/problem');

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

exports.updateGamelog = async (req, res) => {
  console.log('updategamelog')
  try {
    
    await GameLog.updateLog(req.body);

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
  // req.body = [user1: {gitId, profileImg}, user2: {gitId, profileImg}, ...]
  try {
    // const moderater = {
    //   gitId : req.body['gitId'],
    // }

    const info = {
      problemId : await Problem.random(),
      userHistory: req.body.players
    }

    const gameLogId = await GameLog.createLog(info);

    res.status(200).json({
      gameLogId,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};