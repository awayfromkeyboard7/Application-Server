const router = require('express').Router();
const controller = require('./controller');
const gamelog = require('../../../models/gamelog');

router.use('/api/gamelog', gamelog);
router.post('/api/gamelog', controller.create);

module.exports = router;