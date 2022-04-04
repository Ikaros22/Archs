const express = require('express');

const profileControllers = require('../controllers/profile');

const router = express.Router();

router.get('/profile', profileControllers.getMyProfile);

router.get('/hall-of-fame', profileControllers.getFame);

module.exports = router;