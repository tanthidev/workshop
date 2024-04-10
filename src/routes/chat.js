const express = require('express');
const router = express.Router();

const chatController = require('../app/controllers/ChatController');
//middleware
const {checkLogin} = require('../middlewares/authMiddleware')

router.get('/:id',checkLogin, chatController.chat);
router.get('/',checkLogin, chatController.home);

module.exports = router;
