// authMiddleware.js
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { token } = require('morgan');
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
        if(req.user.user.role == 'admin'){
            next()
        } else{
            return res.status(403).send('Access Denied');
        }
    } catch (error) {
        res.render('pages/error/error', {layout: 'sub', error})
    }
    
}


const isAuthenticated = (req, res, next) => {
    if (req.cookies) {
        const token = req.cookies.token;
        if(token){
             // Verify the token
            jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
                if (err) {
                    // If token is invalid, clear user data in req and proceed to next middleware
                    req.user = null;
                } else {
                    // If token is valid, set user data in req and proceed to next middleware
                    req.user = user;
                }
                // Call next middleware
                next()
            });
        } else {
            // If no token, clear user data in req and proceed to next middleware
            req.user = null;
            next();
        }
    } else {
        // If no token, clear user data in req and proceed to next middleware
        req.user = null;
    }
    
    return res.redirect('/')
};
  
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
    checkAdmin,
    isAuthenticated
};
  