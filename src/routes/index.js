const homeRouter = require('./home');
const adminRouter = require('./admin');
const authRouter = require('./auth');
const userRouter = require('./user');
const eventRouter = require('./event');
const {checkLogin, logout} = require('../middlewares/authMiddleware')


function route(app) {
    app.use('/user', userRouter)
    app.use('/auth', authRouter)
    app.use('/admin', adminRouter)
    app.use('/event', eventRouter)
    app.get('/logout', logout);
    app.use('/', homeRouter);
}

module.exports = route;
