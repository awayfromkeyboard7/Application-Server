const request = require('superagent');
const mongoose = require('mongoose');

exports.getCode = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      let info = await GameLog.getCode(req.body['codeId']);

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
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};