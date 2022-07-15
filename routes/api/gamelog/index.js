const router = require('express').Router();
const controller = require('./controller');

router.post('/update', controller.updateGamelog);
router.post('/createNew', controller.createGamelog);
router.post('/getGameLog', controller.getGamelog);

module.exports = router;