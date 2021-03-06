const router = require('express').Router();
const controller = require("./controller");

router.post('/get-info', controller.getGitInfo);
router.post('/getUserInfo', controller.getUserInfo);
router.post('/search', controller.searchUser);
router.post('/paging', controller.pagingRanking);
router.get('/getMyInfo', controller.getMyInfo);
router.get('/count', controller.countUser);

module.exports = router;