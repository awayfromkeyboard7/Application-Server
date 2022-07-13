const request = require('superagent');
const Judge = require('../../../models/judge');
require("dotenv").config();

exports.sendCode = async function(req, res) {
  // judge 도커에 채점 요청
  console.log("Some request accepted");
  
  const codetxt = req.body['code'];

  // If use Judge API
  // const data = await Judge.getResult(codetxt)

  // const retVal = {
  //   results: [true, true, false, false],
  //   msg: [data['output']],
  //   passRate: 50,
  // }

  // console.log(retVal)

  // res.status(200).json(retVal);
  
  console.log("Send request to Container");
  request
    .post(`${process.env.JUDGE_SERVER_URL}/judge`)
    .set('Accept', 'application/json')
    .send({
      language: req.body.language,
      code: codetxt,
      problemId: req.body.problemId
    })
    .then(function(result) {
      console.log("Accept result from docker");
      console.log("Send result to Client");

      let passRate = result.body.results.reduce((a, b) => a + b, 0);
      passRate = passRate / result.body.results.length * 100

      result.body['passRate'] = passRate

      res.status(200).json(result.body);
    })
    .catch(err => {
      console.log("Error: from docker");
      console.error(err);
      res.status(404)
    })
}