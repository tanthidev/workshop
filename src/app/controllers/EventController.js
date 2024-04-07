// const customers = require('../models/customer')
const Event = require('../models/event');
const upload = require('../../middlewares/upload');
class EventController {
    // Hàm xử lý tạo sự kiện
    async handleCreateEvent(req, res) {
         // Gọi middleware upload để xử lý tải lên ảnh
        upload(req, res, async function (err) {
            if (err) {
                console.log(err);
                // Set success flash 
                req.flash('error', 'Create fail!');
                return res.redirect('/admin/event/create');
            }

            // Lấy thông tin từ request body
            const { title, description, dateStart, dateEnd, location, speakers, expenses } = req.body;
            // Kiểm tra xem có file ảnh nền được tải lên hay không
            console.log(req.file);
            if (!req.file) {
                // Set success flash 
                req.flash('error', 'Background is require!');
                return res.redirect('/admin/event/create');
            }

            // Lưu đường dẫn của file ảnh vào biến imagePath
            const imagePath = '/images/' + req.file.filename;

            // Tạo sự kiện với đường dẫn ảnh nền
            const event = new Event({
                title,
                description,
                dateStart,
                dateEnd,
                location,
                speakers,
                expenses,
                backgroundImage: imagePath // Lưu đường dẫn của ảnh nền vào trường backgroundImage của sự kiện
            });

            try {
                // Lưu sự kiện vào cơ sở dữ liệu
                await event.save();
                // Set success flash 
                req.flash('success', 'Create success!');
                return res.redirect('/admin/event/create');
            } catch (error) {
                 // Set success flash 
                 req.flash('error', 'Create fail!!');
                 return res.redirect('/admin/event/create');
            }
        });
    }

    // Chi tiet su kien

    detail(req, res) {
        res.render('event/detail')
    }



}


module.exports = new EventController();
