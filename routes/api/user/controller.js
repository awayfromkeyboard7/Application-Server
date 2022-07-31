// const { json } = require('express');
const fetch = require('node-fetch');
const User = require('../../../models/db/user');
const Auth = require('../../../models/auth');
const jwt = require('jsonwebtoken');

require("dotenv").config();

const SECRETKEY = process.env.JWT_SECRET;
const EXPIRESIN = process.env.EXPIRESIN;
const ISSUER = process.env.ISSUER;

const cookieConfig = { 
  maxAge: 60 * 60 * 2 * 1000,
  // secure: true,
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
  console.log('gitiinfo get ', req.body);
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
      let user = await User.isExist(info['nodeId']);
      if (user === null) {
        user = await User.createUser(info);
      }
      
      const payload = {
        userId: user._id,
        gitId: user.gitId,
        nodeId: user.nodeId,
        avatarUrl: user.avatarUrl,
      };

      const result = jwt.sign(
        payload, 
        SECRETKEY, 
        {
          expiresIn: EXPIRESIN,
          issuer: ISSUER,
        }
      )
      res.cookie('jwt', result, cookieConfig);
      res.status(200).json({ success: true });
    } catch(err) {
      console.log(err);
      res.status(409).json({
        success: false,
      });
    }
  }
}

exports.getUserInfo = async(req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      const UserInfo = await User.getUserInfo(req.body.userId);
      res.status(200).json({
        UserInfo,
        success: UserInfo ? true : false
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}

exports.getMyInfo = async(req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      const UserInfo = await User.getUserInfo(payload.userId);
      res.status(200).json({
        UserInfo,
        success: UserInfo ? true : false
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}

exports.searchUser = async(req, res) => {
  try {
    const payload = await Auth.verify(req.cookies['jwt']);
    if (payload !== false) {
      const UserInfo = await User.getUserInfoByGitId(req.body.gitId);
      res.status(200).json({
        UserInfo,
        success: UserInfo ? true : false
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid JWT Token'
      });
    }
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}

exports.countUser = async (req, res) => {
  try {
    const count = await User.count();

    res.status(200).json({
      count,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};

exports.pagingRanking = async (req, res) => {
  try {
    const ranking = await User.paging(req.body.start, req.body.count);
    console.log('paging user >>', req.body.start, req.body.count);
    res.status(200).json({
      ranking,
      success: true 
    })
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}
