const request = require('superagent');
require("dotenv").config({ path: "../.env.local" });

module.exports = function githubLogin(req, res) {
  const { query } = req;
  const { code } = query;

  if (!code) {
    return res.send({
      success: false,
      message: "Error: no code"
    });
  }

  request
    .post('https://github.com/login/oauth/access_token')
    .send({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    })
    .set('Accept', 'application/json')
    .then(function(result) {
      const data = result.body;
      res.send(data);
    })
}