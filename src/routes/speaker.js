const express = require('express');
const router = express.Router();

const speakerController = require('../app/controllers/SpeakerController');
//middleware
const {checkLogin} = require('../middlewares/authMiddleware')

router.get('/events',checkLogin , speakerController.listEvents);

module.exports = router;
