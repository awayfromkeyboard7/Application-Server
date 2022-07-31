const router = require('express').Router();
const controller = require('./controller');

router.post('/getCode', controller.getCode);

module.exports = router;