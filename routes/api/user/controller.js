const { json } = require('express');
const fetch = require('node-fetch');
const User = require('../../../models/db/user');
const crypto = require('../../../models/keycrypto');

const cookieConfig = { maxAge: 60000000 }

async function getGithubUser (access_token) {
  const req = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `bearer ${access_token}`
    }
  })
  const data = await req.json()
  return data
}


exports.getUser = async(req, res) => {
  try {
    const UserInfo = await User.getUserInfo(req.body.gitId);
    res.status(200).json({
      UserInfo : UserInfo,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}

exports.getGitInfo = async(req, res) => {
  const token = req.body['accessToken']
  const githubData = await getGithubUser(token);

  if (githubData) {
    const info = {
      token,
      gitId: githubData['login'],
      nodeId: githubData['id'],
      avatarUrl: githubData['avatar_url']
    }

    try {
      let user = await User.isExist(githubData['id'], token);
      if (user === null) {
        user = await User.createUser(info);
      }

      res.cookie('avatarUrl', githubData['avatar_url'], cookieConfig);
      res.cookie('gitId', githubData['login'], cookieConfig);
      res.cookie('nodeId', crypto.encrypt(githubData['id'].toString()), cookieConfig);
      res.status(200).json({ success: true });
    } catch(err) {
      console.log(err);
      res.status(409).json({
        success: false,
      });
    }
  } else {
    console.log('Error')
    res.send("Error happend")
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