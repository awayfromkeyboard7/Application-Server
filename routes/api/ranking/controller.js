const Ranking = require('../../../models/db/ranking');

exports.getAllRanking = async (req, res) => {
    try {
        const data = await Ranking.getRanking();
        res.status(200).json({
        data,
        success: true,
      });
    } catch (err) {
      res.status(409).json({
        success: false,
        message: err.message,
      });
    }
  };