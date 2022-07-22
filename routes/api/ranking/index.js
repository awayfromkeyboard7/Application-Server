const router = require('express').Router();
const controller = require('./controller');

router.get('/getRanking', controller.getAllRanking);

module.exports = router;