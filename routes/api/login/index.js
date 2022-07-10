const router = require('express').Router();
const controller = require("./controller");

// 깃허브 로그인
router.get('/', controller.githubLogin);

module.exports = router;