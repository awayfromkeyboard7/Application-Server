const router = require('express').Router();
const controller = require("./controller");

// router.get('/callback', controller.githubCallBack);

router.post('/get-info', controller.getGitInfo);
router.post('/getUser', controller.getUser);

module.exports = router;