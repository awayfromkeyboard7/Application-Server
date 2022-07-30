const request = require('superagent');
const Judge = require('../../../models/judge');
const Auth = require('../../../models/auth');
require("dotenv").config();

exports.sendCode = async function(req, res) {
  // judge 도커에 채점 요청
  console.log("Some request accepted");

  const payload = await Auth.verify(req.cookies['jwt']);
  if (payload.gitId === req.body.gitId) {
    const gitId = req.body['gitId'];
    const problemId = req.body['problemId'];
    const lang = req.body['language'];
    const code = req.body['code'];
    
    console.log("Send request to Container", req.body);
    request
      .post(`${process.env.JUDGE_SERVER_URL}/judge`)
      .set('Accept', 'application/json')
      .send({
        gitId,
        problemId,
        lang,
        code
      })
      .then(function(result) {
        console.log("Accept result from docker");
        console.log("Send result to Client");
        res.status(200).json(result.body);
      })
      .catch(e => {
        console.log(`[ERROR]/judge/${e.name}/${e.message}`);
        res.status(404)
      })
  } else {
    res.status(403).json({
      success: false,
      message: err.message
    });
  }
}