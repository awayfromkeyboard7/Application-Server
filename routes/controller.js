const Github = require("../models/github");
const Problem = require("../models/problem");
const User = require("../models/user");
const GameLog = require("../models/gamelog");
const Ranking = require("../models/ranking");
const request = require('superagent');
require("dotenv").config();

exports.sendCode = async function(req, res) {
  // judge 도커에 채점 요청
  console.log("Some request accepted");
  
  const codetxt = req.body['code'];
  
  console.log("Send request to Container");
  request
    .post(`${process.env.JUDGE_SERVER_URL}/judge`)
    .set('Accept', 'application/json')
    .send({
      code: codetxt
    })
    .then(function(result) {
      console.log("Accept result from docker");
      console.log("Send result to Client");
      console.log(result.body);
      res.status(200).json(result.body);
    })
    .catch(err => {
      console.log("Error: from docker");
      console.error(err);
      res.status(404)
    })
}

exports.githubLogin = function(req, res) {
  try {
    const result = Github(req, res);
  } catch (error) {
    console.error(error)
  } 
}

exports.getProblem = async (req, res) => {
  try {
    const problems = await Problem.findAll();

    res.status(200).json({
      problems,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};