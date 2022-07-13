const { json } = require('express');
const fetch = require('node-fetch');
const User = require('../../../models/user');

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET_KEY;
const cookie_secret = process.env.COOKIE_SECRET;
const redirect_url = process.env.CLIENT_REDIRECT_URL;

const cookieConfigWithKey = {
  maxAge: 60000000,
  signed: true 
}

const cookieConfigWithOutKey = {
  maxAge: 60000000
}

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
      let user = await User.isExist(githubData['id'], token);
      if (user === null) {
        user = await User.createUser(info);
      }

      res.cookie('uimg', githubData['avatar_url'], cookieConfigWithOutKey);
      res.cookie('uname', githubData['login'], cookieConfigWithOutKey);
      res.cookie('uid', githubData['id'], cookieConfigWithKey);
      res.redirect(302, redirect_url);
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