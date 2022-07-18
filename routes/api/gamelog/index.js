const router = require('express').Router();
const controller = require('./controller');

router.post('/update', controller.updateGamelog);
router.post('/createNew', controller.createGamelog);
router.post('/getGameLog', controller.getGamelog);
router.post('/updateTeam', controller.updateGamelogTeam);

module.exports = router;