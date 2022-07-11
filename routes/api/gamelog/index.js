const router = require('express').Router();
const controller = require('./controller');

router.post('/update', controller.updateGamelog);
router.post('/createNew', controller.createGamelog);

module.exports = router;