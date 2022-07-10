const router = require('express').Router();
// const controller = require("./controller");
const controller = require('../problem/controller'); //이렇게 하면 안되는거 아는데 테스트용으로 해봄
const problemApi = require('../../../models/problem');

router.get('/', controller.getProblem);
// 주소는 일단 그냥 따라감

// router.get("/", function (req, res) {
//   res.send("페이지입니다.");
// });

module.exports = router;
