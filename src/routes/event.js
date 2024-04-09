const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const eventController = require('../app/controllers/EventController');
//middleware
const {checkLogin, checkAdmin} = require('../middlewares/authMiddleware')

router.get('/detail/:id' , eventController.detail);
router.get('/edit/:id', checkAdmin, adminController.editEvent)
router.post('/edit/', checkAdmin, adminController.handleEditEvent)
router.get('/delete/:id', checkAdmin, adminController.deleteEvent)
router.get('/payment/:id' , eventController.payment);
router.post('/payment' , eventController.handleRegister);

module.exports = router;
