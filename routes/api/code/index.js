const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.getCode);

module.exports = router;