const homeRouter = require('./home');
const adminRouter = require('./admin');
const authRouter = require('./auth');
const userRouter = require('./user');
const eventRouter = require('./event');
const chatRouter = require('./chat');
const speakerRouter = require('./speaker')
const {checkLogin, logout, checkAdmin} = require('../middlewares/authMiddleware')


const socketController = require('../app/controllers/SocketController');

function route(app) {
    app.use('/user',checkLogin, userRouter)
    app.use('/auth', authRouter)
    app.use('/admin',checkLogin, checkAdmin, adminRouter)
    app.use('/event',checkLogin, eventRouter)
    app.use('/chat',checkLogin, chatRouter)
    app.use('/speaker',checkLogin, speakerRouter)
    app.get('/logout',checkLogin, logout);
    app.use('/', homeRouter);
}

module.exports = route;
