const express = require('express');
const router = express.Router();

//Middleware
const adminController = require('../app/controllers/AdminController');
const EventController = require('../app/controllers/EventController')
const {upload} = require('../middlewares/upload')

router.post('/event/create', EventController.handleCreateEvent)
router.get('/event/create', adminController.createEvent)
router.get('/users', adminController.listUsers)
router.get('/events', adminController.listEvents)
router.get('/', adminController.index);

module.exports = router;