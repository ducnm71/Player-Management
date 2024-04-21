var express = require('express');
var router = express.Router();
const transportController = require('../controller/transportController')

router.get('/', transportController.getAll)

module.exports = router;
