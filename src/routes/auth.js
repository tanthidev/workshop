const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthController');

router.get('/login', authController.login);
router.post('/login', authController.handleLogin);

router.post('/signup', authController.handleSignup);
router.get('/signup', authController.signup);

module.exports = router;