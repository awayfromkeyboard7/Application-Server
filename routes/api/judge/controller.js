const request = require('superagent');
const Judge = require('../../../models/judge');
require("dotenv").config();

exports.sendCode = async function(req, res) {
  // judge 도커에 채점 요청
  console.log("Some request accepted");
  

  const gitId = req.body['gitId'];
  const problemId = req.body['problemId'];
  const lang = req.body['language'];
  const code = req.body['code'];
  
  console.log("Send request to Container");
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

      // let passRate = result.body.results.reduce((a, b) => a + b, 0);
      // passRate = passRate / result.body.results.length * 100

      // result.body['passRate'] = passRate

      res.status(200).json(result.body);
    })
    .catch(err => {
      console.log("Error: from docker");
      console.error(err);
      res.status(404)
    })
}