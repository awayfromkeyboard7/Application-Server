const SENDBIRD_API_TOKEN = process.env.SENDBIRD_API_TOKEN;
const request = require('superagent');
const GameLog = require('../../../models/gamelog');
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
    find_field = req.body['find_field']
    find_field_name = req.body['find_field_name']
    update_field = req.body['update_field']
    update_field_name = req.body['update_field_name']

    const update_gamelog = await GameLog.updateLog(find_field,find_field_name,update_field,update_field_name);

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

