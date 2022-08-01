const fetch = require('node-fetch');
const Judge = require('../../../models/judge');
const Auth = require('../../../models/auth');
const s3 = require('../../../models/upload');

require("dotenv").config();

const judgeJS = process.env.lambdaJS;
const judgePY = process.env.lambdaPY;

exports.sendCode = async function(req, res) {
  const fileName = await s3.uploadFile(req.body);

  const payload = {
    fileName: fileName,
    problemId: req.body['problemId']
  }

  const judgeUrl = req.body['language'] === 'JavaScript' ? judgeJS : judgePY;

  const response = await fetch(judgeUrl, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'}
  })
  const data = await response.json();

  const returnValue = {
    results: data.result,
    passRate: data.passRate,
    msg: data.msg
  };

  console.log("returnValue from lambda: ", returnValue);

  res.status(200).json(returnValue);
}