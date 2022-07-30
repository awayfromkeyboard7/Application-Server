const router = require('express').Router();
const controller = require('./controller');

router.get('/getRanking', controller.getAllRanking);
router.post('/paging', controller.paging);

module.exports = router;