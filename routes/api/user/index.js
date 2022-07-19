const router = require("express").Router();
const { connect } = require("../../../lib/db");
const controller = require("./controller");

// router.get('/callback', controller.githubCallBack);

router.post("/get-info", controller.getGitInfo);

router.post("/getUserSearch", controller.getSearch);

// router.get("/getAllUser", controller.findAll)

module.exports = router;
