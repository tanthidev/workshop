// authMiddleware.js
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const checkLogin = (req, res, next) => {
    try {
        const token = req.cookies.token; // Lấy token từ cookie

        if (!token) {
            // Nếu không có token, chuyển hướng về trang đăng nhập
            return res.redirect('/auth/login');
        }


        //Có token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
            if (err) {
                // Nếu token không hợp lệ, chuyển hướng về trang đăng nhập
                return res.redirect('/auth/login');
            }

            // Lưu thông tin người dùng vào request để sử dụng trong các xử lý tiếp theo
            req.user = user;
            next();
        });
    } catch (error) {
        // res.redirect('/');
        console.log(error);
        res.send(error);
    }
};

const checkAdmin = (req, res, next) => {
    try {
        if(req.user.user.is_admin){
            next()
        } else{
            return res.status(403).send('Access Denied');
        }
    } catch (error) {
        res.render('pages/error/error', {layout: 'sub', error})
    }
    
}
  
const logout = (req, res, next) => {
    // Xóa thông tin người dùng khỏi session
    req.session.destroy();
  
    // Xóa cookie người dùng
    res.clearCookie('token');
  
    // Chuyển hướng đến trang đăng nhập
    res.redirect('/auth/login');
};
  
module.exports = {
    checkLogin,
    logout,
    checkAdmin
};
  