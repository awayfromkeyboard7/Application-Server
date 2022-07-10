const router = require('express').Router();
const controller = require('./controller');
// const gamelog = require('../../../models/gamelog');

// router.use('/', gamelog);
router.post('/', controller.create);
router.post('/update', controller.updateGamelog);

// router.post('/', (req, res) => {
// 	res.status(200).json(req.body);
// });
module.exports = router;