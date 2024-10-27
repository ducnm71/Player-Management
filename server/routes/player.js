var express = require('express');
var router = express.Router();
const playerController = require('../controller/playerController')

router.post('/', playerController.insert)

router.get('/', playerController.list)

module.exports = router;
