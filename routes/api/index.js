const router = require('express').Router();

router.use('/judge', require('./judge'));
router.use('/login', require('./login'));
router.use('/user',  require('./user'));
router.post('/', (req, res) => {
  res.status(200).json({date: "asd"});
	// res.status(200).json(req.body);
});

module.exports = router;