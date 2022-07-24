const router = require('express').Router();
const controller = require("./controller");

router.post('/get-info', controller.getGitInfo);
router.post('/getUser', controller.getUser);
router.post('/get-following', controller.getGitInfo);

module.exports = router;