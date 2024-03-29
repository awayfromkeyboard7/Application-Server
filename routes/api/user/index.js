const router = require('express').Router();
const controller = require("./controller");

router.get('/login', controller.getGitInfo);
router.get('/info', controller.getUserInfo);
router.get('/search', controller.searchUser);
router.get('/rank', controller.pagingRanking);

module.exports = router;