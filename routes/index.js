const router = require('express').Router();
const controller = require("./controller");

// 채점 서버
router.post('/api/judge', controller.sendCode);

// 깃허브 로그인 콜백 화면
router.get('/callback', controller.githubLogin);

// 문제 뿌려주기
router.get('/api/get-problem', controller.getProblem);

module.exports = router;