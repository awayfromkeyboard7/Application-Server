const router = require('express').Router();
const controller = require('./controller');

router.post('/update', controller.updateGamelog);
router.post('/createNew', controller.createGamelog);
router.post('/getProblem', controller.getProblem);
router.post('/getGameLog', controller.getGamelog);
router.post('/updateTeam', controller.updateGamelogTeam);

// 유저 개인전 랭킹 (최근 10회) 가져오는
router.post('/userRankLog', controller.userRankLog)

module.exports = router;