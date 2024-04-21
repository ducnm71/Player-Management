var express = require('express');
var router = express.Router();
const transportController = require('../controller/transportController')

router.post('/', transportController.insert)

router.get('/', transportController.list)

module.exports = router;
