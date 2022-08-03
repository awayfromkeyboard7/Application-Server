const router = require('express').Router();
const controller = require("./controller");

router.get('/', controller.getGitInfo);
router.get('/info', controller.getUserInfo);
router.get('/search', controller.searchUser);
router.get('/paging', controller.pagingRanking);
// router.get('/getMyInfo', controller.getMyInfo);
router.get('/count', controller.countUser);

module.exports = router;