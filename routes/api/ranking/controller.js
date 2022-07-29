const Ranking = require('../../../models/db/ranking');
const Auth = require('../../../models/auth');

exports.getAllRanking = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      const data = await Ranking.getRanking();
      res.status(200).json({
        data,
        success: true,
      });
    } else {
      res.status(403).json({
        success: false,
        message: err.message
      });
    }
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};