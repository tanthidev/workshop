const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');
//middleware
const {checkLogin} = require('../middlewares/authMiddleware')

router.get('/',checkLogin , homeController.index);

module.exports = router;
