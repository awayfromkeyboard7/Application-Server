const Code = require('../../../models/db/code');
const Auth = require('../../../models/auth');
const url = require('url');

exports.getCode = async (req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    const query = url.parse(req.url, true).query;
    console.log(query);
    if (payload !== false) {
      let info = await Code.getCode(query.codeId);
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