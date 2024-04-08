const User = require('../models/user')
const upload = require('../../middlewares/upload');
const mongoose = require('mongoose');

class UserController {
    //GET /news
    profile(req, res) {
        res.render("user/profile", 
            {
                user: req.user.user
            }
        )
    }

    //Handle
    handleChangeProfile(req, res) {
        const { _id, full_name, email, phone, gender, dob } = req.body;
            // Chuyển đổi thành ObjectID
            const objectId = new mongoose.Types.ObjectId(_id);
             // Gọi middleware upload để xử lý tải lên ảnh
            upload(req, res, async function (err) {
                if (err) {
                    // Set fail flash message
                    req.flash('error', 'Update fail!!');
                    return res.redirect('/user/profile');
                }

                // Kiểm tra xem có file ảnh nền được tải lên hay không
                if (!req.file) {
                    // Use Mongoose's updateOne method to update the document
                    User.updateOne({_id }, {full_name, email, phone, gender, dob})
                        .then(result => {
                            console.log(result);
                            // Set success flash 
                            req.flash('success', 'Update success!');
                            return res.redirect('/user/profile');
                        })
                        .catch(error => {
                            // Set fail flash message
                            console.log(error);
                            req.flash('error', 'Update fail!');
                            return res.redirect('/user/profile');
                        });
                } else {
                    // Lưu đường dẫn của file ảnh vào biến imagePath
                    const avt = '/uploads/' + req.file.filename;

                    // Use Mongoose's updateOne method to update the document
                    User.updateOne({ _id }, {full_name, email, phone, gender, dob, avt})
                    .then(result => {
                        // Set success flash message
                        req.flash('success', 'Update success!');
                        return res.redirect('/user/profile');
                    })
                    .catch(error => {
                        // Set fail flash message
                        console.log(error);
                        req.flash('error', 'Update fail!');
                        return res.redirect('/user/profile');
                    });
                }



            });
    }

    //List user (pagination)
    async listUser(req, res){
        
   }



}




module.exports = new UserController();
