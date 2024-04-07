const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');
//middleware
const {checkLogin} = require('../middlewares/authMiddleware')

router.get('/profile',checkLogin , userController.profile);
router.post('/profile', userController.handleChangeProfile);

module.exports = router;
