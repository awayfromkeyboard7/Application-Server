const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createGamelog);
router.post('/getProblem', controller.getProblem);
router.post('/getGameLog', controller.getGamelog);
router.post('/update', controller.updateGamelog);
router.post('/updateTeam', controller.updateGamelogTeam);

module.exports = router;