require("dotenv").config();
const fetch = require('node-fetch');
const Auth = require('../../../models/auth');
const s3 = require('../../../models/upload');

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

    try {
      const response = await fetch(`${process.env.JUDGE_SERVER_URL}/judge`, {
        method: 'post',
        body: JSON.stringify({
          gitId,
          problemId,
          lang,
          code
        }),
        headers: {'Content-Type': 'application/json'}
      })
      const data = await response.json();
      console.log("Accept result from docker");
      console.log("Send result to Client");
      res.status(200).json(data);
    } catch(error) {
      console.log(`[ERROR]/judge/${e.name}/${e.message}`);
      res.status(409)
    }
  } else {
    res.status(403).json({
      success: false,
      message: 'Invalid JWT Token'
    });
  }
}

const judgeJS = process.env.lambdaJS;
const judgePY = process.env.lambdaPY;

exports.judgelambda = async function(req, res) {
  const payload = await Auth.verify(req.cookies['jwt']);
  if (payload.gitId === req.body.gitId) {
    console.log("Some request accepted");
    
    const fileName = await s3.uploadFile(req.body);

    const judgeUrl = req.body['language'] === 'JavaScript' ? judgeJS : judgePY;
  
    const body = {
      fileName: fileName,
      problemId: req.body['problemId']
    }
  
    const response = await fetch(judgeUrl, {
      method: 'post',
      body: JSON.stringify(body),
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
  } else {
    res.status(403).json({
      success: false,
      message: 'Invalid JWT Token'
    });
  }
}