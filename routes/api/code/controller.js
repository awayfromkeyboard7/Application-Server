const request = require('superagent');
const Code = require('../../../models/db/code');
const Auth = require('../../../models/auth');

exports.getCode = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      let info = await Code.getCode(req.body['codeId']);

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