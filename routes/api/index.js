const router = require('express').Router();

router.use('/judge', require('./judge'));
router.use('/user',  require('./user'));
router.use('/gamelog', require('./gamelog'));
router.use('/ranking', require('./ranking'));
router.use('/code', require('./code'));

module.exports = router;
