const SENDBIRD_API_TOKEN = process.env.SENDBIRD_API_TOKEN;

const GameLog = require('../../../models/gamelog');

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
      const channel = await GameLog.create(req.body);
  
      res.status(200).json({
        success: true
      });
    } catch(err) {
      res.status(409).json({
        success: false,
        message: err.message
      });
    }
  };
