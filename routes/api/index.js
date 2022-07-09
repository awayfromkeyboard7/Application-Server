const router = require('express').Router();
const judge = require('./judge');
const gamelog = require('./gamelog');

router.use('/judge', judge);

router.use('/gamelog', gamelog);

module.exports = router;