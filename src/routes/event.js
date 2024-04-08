const express = require('express');
const router = express.Router();

const eventController = require('../app/controllers/EventController');
//middleware
const {checkLogin} = require('../middlewares/authMiddleware')

router.get('/detail/:id' , eventController.detail);
router.get('/payment/:id' , eventController.payment);
router.post('/payment' , eventController.handleRegister);

module.exports = router;
