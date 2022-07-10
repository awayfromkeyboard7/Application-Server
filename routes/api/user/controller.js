const { json } = require('express');
const fetch = require('node-fetch');
const User = require('../../../models/user');

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET_KEY;
const cookie_secret = process.env.COOKIE_SECRET;

async function getAccessToken (code) {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    }, 
    body: JSON.stringify({
      client_id,
      client_secret,
      code
    })
  })
  const data = await res.text();
  const params = new URLSearchParams(data);
  console.log(params);
  return params.get('access_token');
}

async function getGithubUser (access_token) {
  const req = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `bearer ${access_token}`
    }
  })
  const data = await req.json()
  return data
}

exports.githubCallBack = async (req, res) => {
  const code = req.query.code
  const token = await getAccessToken(code);
  const githubData = await getGithubUser(token);

  if (githubData) {
    const info = {
      token,
      gitId: githubData['login'],
      nodeId: githubData['id'],
      imgUrl: githubData['avatar_url']
    }

    try {
      console.log(">>>>>>>>>> HERE");
      let user = await User.isExist(githubData['id'], token);
      console.log("Done");
      if (user === null) {
        user = await User.createUser(info);
      }
      res.status(200).json({
        user,
        success: true
      });
    } catch(err) {
      console.log(err);
      res.status(409).json({
        success: false,
        message: err.message
      });
    }
  } else {
    console.log('Error')
    res.send("Error happend")
  }
}