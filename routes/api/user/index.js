const router = require("express").Router();
const { connect } = require("../../../lib/db");
const controller = require("./controller");

router.post('/get-info', controller.getGitInfo);
router.post('/getUser', controller.getUser);
router.post("/getUserSearch", controller.getSearch);
router.post('/get-following', controller.getGitInfo);

module.exports = router;

