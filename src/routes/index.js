const homeRouter = require('./home');
const adminRouter = require('./admin');
const authRouter = require('./auth');
const userRouter = require('./user');
const eventRouter = require('./event');
const {checkLogin, logout, checkAdmin} = require('../middlewares/authMiddleware')


function route(app) {
    app.use('/user',checkLogin, userRouter)
    app.use('/auth', authRouter)
    app.use('/admin',checkLogin, checkAdmin, adminRouter)
    app.use('/event',checkLogin, eventRouter)
    app.get('/logout',checkLogin, logout);
    app.use('/', homeRouter);
}

module.exports = route;
