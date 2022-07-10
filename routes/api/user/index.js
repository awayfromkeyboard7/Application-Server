const router = require('express').Router();
const controller = require("./controller");

router.get('/callback', controller.githubCallBack);

router.get('/get-info', controller.githubCallBack);

module.exports = router;