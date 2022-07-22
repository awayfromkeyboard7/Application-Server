// const request = require('superagent');
// const mongoose = require('mongoose');
// const GameLog = require('../../../models/gamelog');
// const Interval = require('../../../models/interval');
// const Problem = require('../../../models/problem');
// const User = require('../../../models/user');
const Ranking = require('../../../models/ranking');


exports.getAllRanking = async (req, res) => {
    try {
        const data = await Ranking.getRanking();
        console.log("passhere????!@!@@!@@!?@!?@!?@!@!?@!?@")
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