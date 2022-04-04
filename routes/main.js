const express = require('express');

const router = express.Router();

const mainController = require('../controllers/main');

router.get('/', mainController.getGo);

router.post('/result', mainController.postResult);

module.exports = router;