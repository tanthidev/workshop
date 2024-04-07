const express = require('express');
const router = express.Router();

const eventController = require('../app/controllers/EventController');
//middleware
const {checkLogin} = require('../middlewares/authMiddleware')

router.get('/detail/:id',checkLogin , eventController.detail);

module.exports = router;
