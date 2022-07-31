const router = require('express').Router();
const controller = require('./controller');

router.post('/post', controller.getCode);

module.exports = router;