const router = require('express').Router();
const controller = require("./controller");

// 채점 서버
router.post('/', controller.judgeLambda);
module.exports = router;