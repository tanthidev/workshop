const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');
//middleware
const {checkLogin} = require('../middlewares/authMiddleware')

router.get('/profile' , userController.profile);
router.post('/profile', userController.handleChangeProfile);

router.get('/events', userController.eventsRegister)

module.exports = router;
