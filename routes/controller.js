const Github = require("../models/github");
const request = require('superagent');
// require("dotenv").config();

exports.githubLogin = function(req, res) {
  try {
    const result = Github(req, res);
  } catch (error) {
    console.error(error)
  } 
}