const { json } = require('express');
const fetch = require('node-fetch');
const User = require('../../../models/user');
const crypto = require('../../../models/keycrypto');

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
      avatarUrl: githubData['avatar_url']
    }

    try {
      let user = await User.isExist(githubData['id'], token);
      if (user === null) {
        user = await User.createUser(info);
      }

      res.cookie('avatarUrl', githubData['avatar_url'], { maxAge: 60000000 });
      res.cookie('gitId', githubData['login'], { maxAge: 60000000 });
      res.cookie('nodeId', crypto.encrypt(githubData['id'].toString()), { maxAge: 60000000 });
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