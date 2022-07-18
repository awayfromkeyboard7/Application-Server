const router = require('express').Router();
const controller = require("./controller");

// router.get('/callback', controller.githubCallBack);

router.post('/get-info', controller.getGitInfo);

module.exports = router;