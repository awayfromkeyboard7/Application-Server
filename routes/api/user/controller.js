const { json } = require('express');
const fetch = require('node-fetch');
const User = require('../../../models/user');

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET_KEY;
const cookie_secret = process.env.COOKIE_SECRET;
const redirect_url = process.env.CLIENT_REDIRECT_URL;

const cookieConfigWithKey = {
  maxAge: 60000000,
  signed: true,
}

const cookieConfigWithOutKey = {
  maxAge: 60000000,
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

exports.getGitInfo = async(req, res) => {
  const token = req.body['accessToken']
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
      res.status(200).json({ success: true });
      
    } catch(err) {
      res.status(409).json({
        success: false,
      });
    }
  } else {
    console.log('Error')
    res.send("Error happend")
  }
}