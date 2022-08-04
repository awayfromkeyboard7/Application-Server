const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createGamelog);
router.get('/', controller.getGamelog);
router.get('/problem', controller.getProblem);
router.put('/:mode', controller.updateGamelog);

module.exports = router;