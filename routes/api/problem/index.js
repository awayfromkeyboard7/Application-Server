const router = require('express').Router();
// const controller = require("./controller");
const controller = require('../problem/controller'); //이렇게 하면 안되는거 아는데 테스트용으로 해봄
const problemApi = require('../../../models/db/problem');

router.get('/', controller.getProblem);

module.exports = router;
