const express = require('express');
const { check } = require('express-validator');

const User = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login',
  [
    check('email').isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    check('password', 'Use at least 5 signs')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin);

 router.get('/logout', authController.getLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', [
  check('email').isEmail().withMessage("Please enter a valid email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value })
      if (user)
        return Promise.reject('E-Mail in  use');
    })
    .normalizeEmail(),
  check('nickname').isAlphanumeric().withMessage('Use at least 5 alphanumeric signs')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ nickname: value })
      if (user)
        return Promise.reject('Nickname in  use');
    })
    .trim(),
  check('password', 'Use at least 5 alphanumeric signs')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true
      }
      return false;
    })
    .withMessage('Passwords have to match!')
],
  authController.postSignup);

module.exports = router;