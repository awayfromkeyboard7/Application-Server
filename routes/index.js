const router = require('express').Router();
const controller = require("./controller");
// require("dotenv").config();

// 깃허브 로그인 콜백 화면
router.get('/callback', controller.githubLogin);

router.get('/')
module.exports = router;