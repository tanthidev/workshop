const homeRouter = require('./home');
const adminRouter = require('./admin');
const authRouter = require('./auth');
const {checkLogin, logout} = require('../middlewares/authMiddleware')
function route(app) {

    app.use('/auth', authRouter)
    app.use('/admin', adminRouter)
    app.use('/', homeRouter);
    app.get('/logout', logout);
}

module.exports = route;
