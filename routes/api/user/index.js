const router = require('express').Router();
const controller = require("./controller");

router.post('/get-info', controller.getGitInfo);

module.exports = router;