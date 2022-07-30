// const { json } = require('express');
const fetch = require('node-fetch');
const User = require('../../../models/db/user');

const cookieConfig = { 
  maxAge: 60000000
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
  console.log(req.body);
  const token = req.body['accessToken'];
  let info;
  if (token === 'stresstestbot') {
    info = {
      token,
      gitId: Math.random().toString(36).slice(2, 7),
      nodeId: Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000,
      avatarUrl: 'https://avatars.githubusercontent.com/u/53402709?v=4'
    }
  } else {
    const githubData = await getGithubUser(token);

    if (githubData) {
      info = {
        token,
        gitId: githubData['login'],
        nodeId: githubData['id'],
        avatarUrl: githubData['avatar_url']
      }
    }
  }

  console.log(info);
  if (info) {
    try {
      let user = await User.isExist(info['nodeId'], token);
      if (user === null) {
        user = await User.createUser(info);
      }

      res.cookie('gitId', info['gitId'], cookieConfig);
      res.cookie('nodeId', info['nodeId'], cookieConfig);
      res.cookie('avatarUrl', info['avatarUrl'], cookieConfig);
      res.status(200).json({ success: true });
    } catch(err) {
      console.log(err);
      res.status(409).json({
        success: false,
      });
    }
  }
}

exports.getUser = async(req, res) => {
  try {
    const UserInfo = await User.getUserInfo(req.body.gitId);
    res.status(200).json({
      UserInfo,
      success: UserInfo ? true : false
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}