const router = require('express').Router();

router.use('/judge', require('./judge').default);
router.use('/login', require('./login').default);
router.use('/user',  require('./user'));
router.use('/gamelog', require('./gamelog').default);
router.use('/problem', require('./problem').default);
router.use('/ranking', require('./ranking').default);

module.exports = router;
