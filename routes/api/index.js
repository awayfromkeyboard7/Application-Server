const router = require('express').Router();
const judge = require('./judge');

router.use('/judge', judge);
router.post('/', (req, res) => {
	res.status(200).json(req.body);
});

module.exports = router;